import { DEFAULT_PAGINATION_SIZE } from '@domain/common/constants/pagination.constants';
import { IPagination } from '@domain/model/common/pagination';
import { MessageModel } from '@domain/model/database/message';
import { MessageChannelModel } from '@domain/model/database/message-channel';
import { IMessageChannelRepository } from '@domain/repositories/message-channel.repository.interface';
import { IMessageRepository } from '@domain/repositories/message.repository.interface';
import dayjs from 'dayjs';
import { Types } from 'mongoose';

export class GetMessagesUseCases {
  constructor(
    private readonly messageChannelRepository: IMessageChannelRepository,
    private readonly messageRepository: IMessageRepository,
  ) {}

  async getMessagesByPagination(
    channelId: Types.ObjectId,
    pagination: IPagination,
  ): Promise<MessageModel[]> {
    return await this.messageChannelRepository.aggregateMessagesByPagination(
      channelId,
      {
        page: pagination.page ? pagination.page : 0,
        size: pagination.size ? pagination.size : DEFAULT_PAGINATION_SIZE,
        requested_at: pagination.requested_at
          ? pagination.requested_at
          : dayjs().toDate(),
      },
    );
  }

  async updateMessagesIsRead(
    userId: Types.ObjectId,
    channelId: Types.ObjectId,
  ): Promise<void> {
    const messageChannel =
      await this.messageChannelRepository.findOneByChannelId(channelId);
    if (!messageChannel) {
      return;
    }
    await this.messageRepository.updateMessagesIsRead(
      userId,
      messageChannel.message_ids,
    );
  }
}
