import { UserModel } from '@domain/model/database/user';
import { AuthJwt } from '@infrastructure/common/decorators/auth.decorator';
import { User } from '@infrastructure/common/decorators/user.decorator';
import { ApiResponseType } from '@infrastructure/common/decorators/response.decorator';
import { ChatGateway } from '@infrastructure/gateways/base/chat.gateway';
import { UseCaseProxy } from '@infrastructure/usercases-proxy/usecases-proxy';
import { UseCasesProxyModule } from '@infrastructure/usercases-proxy/usecases-proxy.module';
import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMessageUseCases } from '@usecases/chat/create-message.usecases';
import { Connection } from 'mongoose';
import { CreateMessageDto, MessagesQueryDto } from './message.dto';
import { MessagePresenter } from './message.presenter';
import { GetMessagesUseCases } from '@usecases/chat/get-messages.usecases';
import { MessageModel } from '@domain/model/database/message';
import { ExceptionsService } from '@infrastructure/services/exceptions/exceptions.service';
import { CoupleGuard } from '@infrastructure/common/guards/couple.guard';

@Controller('message')
@ApiTags('Message')
@ApiInternalServerErrorResponse({
  description: '확인되지 않은 서버에러, error_code: -6',
})
@ApiForbiddenResponse({
  description:
    '커플기능이 활성화 되지않아 채팅 서비스를 이용할 수 없는 경우(error_code: -5)',
})
@ApiExtraModels(MessagePresenter)
export class MessageController {
  constructor(
    @Inject(UseCasesProxyModule.CREATE_MESSAGE_USECASES_PROXY)
    private readonly createMessageUseCaseProxy: UseCaseProxy<CreateMessageUseCases>,
    @Inject(UseCasesProxyModule.GET_MESSAGES_USECASES_PROXY)
    private readonly getMessagesUseCaseProxy: UseCaseProxy<GetMessagesUseCases>,
    @InjectConnection() private connection: Connection,
    private readonly baseGateway: ChatGateway,
    private readonly exceptionService: ExceptionsService,
  ) {}

  @Post('send')
  @AuthJwt(CoupleGuard)
  @ApiOperation({
    summary: '메세지 보내기',
    description: 'server event: sendMessage</n>client event : onMessageUpdate',
  })
  @ApiResponseType(MessagePresenter)
  async createMessage(@User() user: UserModel, @Body() data: CreateMessageDto) {
    const useCase = this.createMessageUseCaseProxy.getInstance();
    const session = await this.connection.startSession();
    let newMessage: MessageModel | null = null;
    try {
      session.startTransaction();

      newMessage = await useCase.createMessage(
        user._id,
        user.channel_id,
        data,
        session,
      );

      await useCase.updateMessageChannelMessage(
        user.channel_id,
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

    const result = new MessagePresenter(newMessage);

    this.baseGateway.server
      .to(user.channel_id.toString())
      .emit('onMessageUpdate', result);

    return result;
  }

  @Get('list')
  @AuthJwt(CoupleGuard)
  @ApiOperation({
    summary: '메세지 리스트 불러오기',
    description: 'socket event : onMessagesUpdate',
  })
  @ApiResponseType(MessagePresenter, true)
  async getMessagesByQuery(
    @User() user: UserModel,
    @Query() data: MessagesQueryDto,
  ) {
    const useCase = this.getMessagesUseCaseProxy.getInstance();
    await useCase.updateMessagesIsRead(user._id, user.channel_id);

    const messages = await useCase.getMessagesByPagination(
      user.channel_id,
      data,
    );

    const result = messages.map((i) => new MessagePresenter(i));

    this.baseGateway.server
      .to(user._id.toString())
      .emit('onMessagesUpdate', result);

    return result;
  }
}
