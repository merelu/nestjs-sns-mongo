import { SchemaNames } from '@domain/common/constants/schema-names';
import { AccessTypeEnum } from '@domain/common/enums/feed/access-type.enum';
import { ImageModel } from '@domain/model/database/image';
import { UserSimpleModel } from '@domain/model/database/user';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Document, SchemaTypes, Types } from 'mongoose';
import { CustomSchemaOptions } from './custom-schema.option';
import { ImageSchema } from './image.entity';

export type FeedDocument = Feed & Document;
@Schema(CustomSchemaOptions)
export class Feed {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SchemaNames.user,
    required: true,
  })
  writer_id: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SchemaNames.channel,
    required: true,
  })
  channel_id: Types.ObjectId;

  @Prop({
    type: Number,
    enum: AccessTypeEnum,
    required: true,
    default: AccessTypeEnum.private,
  })
  access_type: AccessTypeEnum;

  @Prop({ type: [ImageSchema], default: [] })
  photos: ImageModel[];

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Date, default: dayjs().toDate() })
  dating_date: Date;

  @Prop({ type: [SchemaTypes.ObjectId], ref: SchemaNames.user, default: [] })
  liker_ids: Types.ObjectId[];

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Date })
  deleted_at: Date;

  readonly writer: UserSimpleModel;
  readonly created_at: Date;
  readonly updated_at: Date;
}

const _FeedSchema = SchemaFactory.createForClass(Feed);

_FeedSchema.virtual('writer', {
  ref: SchemaNames.user,
  localField: 'writer_id',
  foreignField: '_id',
  justOne: true,
});

_FeedSchema.set('toObject', { virtuals: true });
_FeedSchema.set('toJSON', { virtuals: true });

export const FeedSchema = _FeedSchema;
