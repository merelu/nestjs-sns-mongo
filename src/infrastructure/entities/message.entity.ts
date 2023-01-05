import { SchemaNames } from '@domain/common/constants/schema-names';
import { MessageType } from '@domain/common/enums/message.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { CustomSchemaOptions } from './custom-schema.option';

export type MessageDocument = Message & Document;

@Schema(CustomSchemaOptions)
export class Message {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SchemaNames.user,
    required: true,
  })
  sender_id: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SchemaNames.channel,
    required: true,
  })
  channel_id: Types.ObjectId;

  @Prop({
    type: Number,
    enum: MessageType,
    required: true,
  })
  type: MessageType;

  @Prop({ type: String, default: '' })
  content: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: SchemaNames.user, default: [] })
  read_user_ids: Types.ObjectId[];

  readonly created_at: Date;
  readonly updated_at: Date;
}

const _MessageSchema = SchemaFactory.createForClass(Message);

export const MessageSchema = _MessageSchema;
