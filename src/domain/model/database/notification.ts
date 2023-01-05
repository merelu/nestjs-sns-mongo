import { FcmEventTypeEnum } from '@domain/common/enums/fcm-event-type.enum';
import { PickType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';

export class NotificationModel {
  _id: Types.ObjectId;

  title: string;

  body: string;

  event_type: FcmEventTypeEnum;

  read: boolean;

  created_at: Date;
  updated_at: Date;
}

export class AddNotificationModel extends PickType(NotificationModel, [
  'title',
  'body',
  'event_type',
] as const) {}
