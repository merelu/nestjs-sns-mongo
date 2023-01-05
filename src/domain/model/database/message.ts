import { MessageType } from '@domain/common/enums/message.enum';
import { PickType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';

export class MessageModel {
  _id: Types.ObjectId;
  sender_id: Types.ObjectId;
  channel_id: Types.ObjectId;
  type: MessageType;
  content: string;
  read_user_ids: Types.ObjectId[];

  created_at: Date;
  updated_at: Date;
}

export class CreateMessageModel extends PickType(MessageModel, [
  'sender_id',
  'channel_id',
  'type',
  'content',
] as const) {}
