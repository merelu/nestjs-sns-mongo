import { PickType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';
import { MessageModel } from './message';
import { UserSimpleModel } from './user';

export class MessageChannelModel {
  _id: Types.ObjectId;
  channel_id: Types.ObjectId;
  message_ids: Types.ObjectId[];
  last_message_id: Types.ObjectId;
  last_message_updated_at: Date;

  created_at: Date;
  updated_at: Date;

  messages: MessageModel[];
  last_message: MessageModel;
}

export class CreateMessageChannelModel extends PickType(MessageChannelModel, [
  'channel_id',
] as const) {}

export class MessageChannelSimpleModel extends PickType(MessageChannelModel, [
  '_id',
  'last_message',
  'last_message_updated_at',
] as const) {}
