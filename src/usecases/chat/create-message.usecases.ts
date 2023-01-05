import { CreateMessageModel } from '@domain/model/database/message';
import { IMessageChannelRepository } from '@domain/repositories/message-channel.repository.interface';
import { IMessageRepository } from '@domain/repositories/message.repository.interface';
import { CreateMessageDto } from '@infrastructure/controllers/message/message.dto';
import dayjs from 'dayjs';
import { ClientSession, Types } from 'mongoose';

export class CreateMessageUseCases {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly messageChannelRepository: IMessageChannelRepository,
  ) {}

  async createMessage(
    userId: Types.ObjectId,
    channelId: Types.ObjectId,
    data: CreateMessageDto,
    session?: ClientSession,
  ) {
    const newMessageModel = new CreateMessageModel();
    newMessageModel.sender_id = userId;
    newMessageModel.channel_id = channelId;
    newMessageModel.content = data.content;
    newMessageModel.type = data.type;

    return await this.messageRepository.insert(newMessageModel, session);
  }

  async updateMessageChannelMessage(
    channelId: Types.ObjectId,
    messageId: Types.ObjectId,
    session?: ClientSession,
  ) {
    await this.messageChannelRepository.updateMessageChannelByQuery(
      channelId,
      {
        $addToSet: { message_ids: messageId },
        $set: {
          last_message_id: messageId,
          last_message_updated_at: dayjs().toDate(),
        },
      },
      session,
    );
  }
}
