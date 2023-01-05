import { SchemaNames } from '@domain/common/constants/schema-names';
import { MessageModel } from '@domain/model/database/message';
import { UserSimpleModel } from '@domain/model/database/user';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { CustomSchemaOptions } from './custom-schema.option';

export type MessageChannelDocument = MessageChannel & Document;

@Schema(CustomSchemaOptions)
export class MessageChannel {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SchemaNames.channel,
    required: true,
    unique: true,
  })
  channel_id: Types.ObjectId;

  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: SchemaNames.message,
    default: [],
  })
  message_ids: Types.ObjectId[];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SchemaNames.message,
    default: null,
  })
  last_message_id: Types.ObjectId;

  @Prop({ type: Date, default: null })
  last_message_updated_at: Date;

  readonly created_at: Date;
  readonly updated_at: Date;
  readonly messages: MessageModel[];
  readonly last_message: MessageModel;
  readonly members: UserSimpleModel[];
}

const _MessageChannelSchema = SchemaFactory.createForClass(MessageChannel);

_MessageChannelSchema.virtual('messages', {
  ref: SchemaNames.message,
  localField: 'message_ids',
  foreignField: '_id',
});

_MessageChannelSchema.virtual('last_message', {
  ref: SchemaNames.message,
  localField: 'last_message_id',
  foreignField: '_id',
  options: { sort: { created_at: -1 } },
  justOne: true,
});

_MessageChannelSchema.set('toObject', { virtuals: true });
_MessageChannelSchema.set('toJSON', { virtuals: true });

export const MessageChannelSchema = _MessageChannelSchema;
