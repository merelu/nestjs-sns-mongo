import { IPagination } from '@domain/model/common/pagination';
import { MessageModel } from '@domain/model/database/message';
import {
  CreateMessageChannelModel,
  MessageChannelModel,
} from '@domain/model/database/message-channel';
import { MessageChannelDocument } from '@infrastructure/entities/message-channel.entity';
import { ClientSession, FilterQuery, Types, UpdateQuery } from 'mongoose';

export interface IMessageChannelRepository {
  insert(
    data: CreateMessageChannelModel,
    session?: ClientSession,
  ): Promise<MessageChannelModel>;

  findOneByChannelId(
    channelId: Types.ObjectId,
  ): Promise<MessageChannelModel | null>;

  findOneByChannelIdAndPopulate(
    channelId: Types.ObjectId,
  ): Promise<MessageChannelModel | null>;

  findChannelByQuery(
    query: FilterQuery<MessageChannelDocument>,
  ): Promise<MessageChannelModel | null>;

  updateMessageChannelByQuery(
    channelId: Types.ObjectId,
    updateQuery: UpdateQuery<MessageChannelModel>,
    session?: ClientSession,
  ): Promise<void>;

  aggregateMessagesByPagination(
    channelId: Types.ObjectId,
    pagination: IPagination,
  ): Promise<MessageModel[]>;
}
