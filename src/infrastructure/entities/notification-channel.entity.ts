import { SchemaNames } from '@domain/common/constants/schema-names';
import { NotificationModel } from '@domain/model/database/notification';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { CustomSchemaOptions } from './custom-schema.option';
import { NotificationSchema } from './notification.entity';

export type NotificationChannelDocument = NotificationChannel & Document;
@Schema(CustomSchemaOptions)
export class NotificationChannel {
  @Prop({ type: SchemaTypes.ObjectId, ref: SchemaNames.user, unique: true })
  user_id: Types.ObjectId;

  @Prop({ type: [NotificationSchema], default: [] })
  notifications: NotificationModel[];

  readonly created_at: Date;
  readonly updated_at: Date;
}

const _NotificationChannelSchema =
  SchemaFactory.createForClass(NotificationChannel);

export const NotificationChannelSchema = _NotificationChannelSchema;
