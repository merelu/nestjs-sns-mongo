import { MessageModel } from '@domain/model/database/message';
import { AuthenticatedSocket } from '@infrastructure/common/adapter/redis-io.adapter';
import { WsExceptionFilter } from '@infrastructure/common/filter/ws-exception.filter';
import {
  CreateMessageDto,
  MessagesQueryDto,
} from '@infrastructure/controllers/message/message.dto';
import { MessagePresenter } from '@infrastructure/controllers/message/message.presenter';
import { ExceptionsService } from '@infrastructure/services/exceptions/exceptions.service';
import { LoggerService } from '@infrastructure/services/logger/logger.service';
import { UseCaseProxy } from '@infrastructure/usercases-proxy/usecases-proxy';
import { UseCasesProxyModule } from '@infrastructure/usercases-proxy/usecases-proxy.module';
import { Inject, UseFilters } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GetMessagesUseCases } from '@usecases/chat/get-messages.usecases';
import { CreateMessageUseCases } from '@usecases/chat/create-message.usecases';
import { Connection } from 'mongoose';
import { Server } from 'socket.io';

@UseFilters(new WsExceptionFilter(new LoggerService()))
@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(UseCasesProxyModule.GET_MESSAGES_USECASES_PROXY)
    private readonly getMessagesUseCaseProxy: UseCaseProxy<GetMessagesUseCases>,
    @Inject(UseCasesProxyModule.CREATE_MESSAGE_USECASES_PROXY)
    private readonly createMessageUseCaseProxy: UseCaseProxy<CreateMessageUseCases>,
    @InjectConnection()
    private connection: Connection,
    private readonly exceptionService: ExceptionsService,
    private readonly logger: LoggerService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    this.logger.log('Socket Init', 'connected');
  }

  async handleConnection(socket: AuthenticatedSocket) {
    const channelId = socket.data.channel_id.toString();
    socket.join(channelId);
    socket.join(socket.data._id.toString());

    const onlineSockets = await socket.in(channelId).fetchSockets();
    console.log(
      'debug',
      onlineSockets.map((socket) => console.log(socket.data)),
    );
    const users = new Set(
      onlineSockets.map((socket) => socket.data._id.toString()),
    );

    socket.nsp.emit('onOnlineUsers', [...users]);
  }

  async handleDisconnect(@ConnectedSocket() socket: AuthenticatedSocket) {
    const onlineSockets = await socket
      .in(socket.data.channel_id.toString())
      .fetchSockets();
    const users = new Set(
      onlineSockets.map((socket) => socket.data['user']._id.toString()),
    );
    socket.nsp.emit('onOnlineUsers', [...users]);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() data: CreateMessageDto,
  ) {
    const session = await this.connection.startSession();
    const useCase = this.createMessageUseCaseProxy.getInstance();
    let newMessage: MessageModel | null = null;

    try {
      session.startTransaction();
      newMessage = await useCase.createMessage(
        socket.data._id,
        socket.data.channel_id,
        data,
        session,
      );

      await useCase.updateMessageChannelMessage(
        socket.data.channel_id,
        newMessage._id,
        session,
      );

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }

    socket
      .to(socket.data.channel_id.toString())
      .emit('onMessageUpdate', new MessagePresenter(newMessage));
  }

  @SubscribeMessage('messages')
  async getChannelsMessages(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() data: MessagesQueryDto,
  ) {
    const useCase = this.getMessagesUseCaseProxy.getInstance();
    await useCase.updateMessagesIsRead(socket.data._id, socket.data.channel_id);
    const messages = await useCase.getMessagesByPagination(
      socket.data.channel_id,
      data,
    );

    return {
      event: 'onMessagesUpdate',
      data: messages.map((i) => new MessagePresenter(i)),
    };
  }
}
