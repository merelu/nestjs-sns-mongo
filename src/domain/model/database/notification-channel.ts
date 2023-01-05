import { PickType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';
import { NotificationModel } from './notification';

export class NotificationChannelModel {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  notifications: NotificationModel[];

  created_at: Date;
  updated_at: Date;
}

export class CreateNotificationChannelModel extends PickType(
  NotificationChannelModel,
  ['user_id'] as const,
) {}
