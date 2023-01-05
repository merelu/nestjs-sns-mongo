import { IPagination } from '@domain/model/common/pagination';
import { AddNotificationModel } from '@domain/model/database/notification';
import {
  CreateNotificationChannelModel,
  NotificationChannelModel,
} from '@domain/model/database/notification-channel';
import { ClientSession, Types } from 'mongoose';

export interface INotificationChannelRepository {
  insert(
    data: CreateNotificationChannelModel,
    session?: ClientSession,
  ): Promise<NotificationChannelModel>;

  findByUserId(
    userId: Types.ObjectId,
  ): Promise<NotificationChannelModel | null>;

  addNotification(
    userId: Types.ObjectId,
    data: AddNotificationModel,
    session?: ClientSession,
  ): Promise<void>;

  updateNotificationRead(
    userId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<void>;

  aggregateNotificationsByPagination(
    userId: Types.ObjectId,
    pagination: IPagination,
  ): Promise<NotificationChannelModel | null>;
}
