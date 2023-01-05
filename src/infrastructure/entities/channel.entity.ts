import { SchemaNames } from '@domain/common/constants/schema-names';
import { ChannelStatusEnum } from '@domain/common/enums/channel/channel-status.enum';
import { AlbumModel } from '@domain/model/database/album';
import { CoupleInfoSimpleModel } from '@domain/model/database/couple-info';
import { MessageChannelSimpleModel } from '@domain/model/database/message-channel';
import { UserSimpleModel } from '@domain/model/database/user';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { CustomSchemaOptions } from './custom-schema.option';

export type ChannelDocument = Channel & Document;
@Schema(CustomSchemaOptions)
export class Channel {
  @Prop({ type: [SchemaTypes.ObjectId], ref: SchemaNames.user, default: [] })
  member_ids: Types.ObjectId[];

  @Prop({ type: String, default: null })
  code: string;

  @Prop({
    type: Number,
    enum: ChannelStatusEnum,
    default: ChannelStatusEnum.active,
  })
  status: ChannelStatusEnum;

  readonly couple_info: CoupleInfoSimpleModel;
  readonly members: UserSimpleModel[];
  readonly message_channel: MessageChannelSimpleModel;
  readonly album: AlbumModel;

  readonly created_at: Date;
  readonly updated_at: Date;
}

const _ChannelSchema = SchemaFactory.createForClass(Channel);

_ChannelSchema.virtual('couple_info', {
  ref: SchemaNames.coupleInfo,
  localField: '_id',
  foreignField: 'channel_id',
  justOne: true,
});

_ChannelSchema.virtual('members', {
  ref: SchemaNames.user,
  localField: 'member_ids',
  foreignField: '_id',
});

_ChannelSchema.virtual('message_channel', {
  ref: SchemaNames.messageChannel,
  localField: '_id',
  foreignField: 'channel_id',
  justOne: true,
});

_ChannelSchema.virtual('album', {
  ref: SchemaNames.album,
  localField: '_id',
  foreignField: 'channel_id',
  justOne: true,
});

_ChannelSchema.set('toObject', { virtuals: true });
_ChannelSchema.set('toJSON', { virtuals: true });

export const ChannelSchema = _ChannelSchema;
