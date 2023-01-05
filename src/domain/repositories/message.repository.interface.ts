import { IPagination } from '@domain/model/common/pagination';
import {
  CreateMessageModel,
  MessageModel,
} from '@domain/model/database/message';
import { MessageDocument } from '@infrastructure/entities/message.entity';
import { ClientSession, FilterQuery, Types } from 'mongoose';

export interface IMessageRepository {
  insert(
    data: CreateMessageModel,
    session?: ClientSession,
  ): Promise<MessageModel>;

  getMessagesByQuery(
    query: FilterQuery<MessageDocument>,
  ): Promise<MessageModel[]>;

  updateMessagesIsRead(
    userId: Types.ObjectId,
    messageIds: Types.ObjectId[],
    session?: ClientSession,
  ): Promise<void>;
}
