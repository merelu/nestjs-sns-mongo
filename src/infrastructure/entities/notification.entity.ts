import { FcmEventTypeEnum } from '@domain/common/enums/fcm-event-type.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CustomSchemaOptions } from './custom-schema.option';

export type NotificationDocument = Notification & Document;

@Schema(CustomSchemaOptions)
export class Notification {
  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  body: string;

  @Prop({ Type: Number, enum: FcmEventTypeEnum, required: true })
  event_type: FcmEventTypeEnum;

  @Prop({ Type: Boolean, default: false })
  read: boolean;

  readonly created_at: Date;
  readonly updated_at: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
