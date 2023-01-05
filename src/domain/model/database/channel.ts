import { ChannelStatusEnum } from '@domain/common/enums/channel/channel-status.enum';
import { PickType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';
import { AlbumModel } from './album';
import { CoupleInfoSimpleModel } from './couple-info';
import { MessageChannelSimpleModel } from './message-channel';
import { UserSimpleModel } from './user';

export class ChannelModel {
  _id: Types.ObjectId;
  member_ids: Types.ObjectId[];
  code: string;
  status: ChannelStatusEnum;

  couple_info: CoupleInfoSimpleModel;
  members: UserSimpleModel[];
  message_channel: MessageChannelSimpleModel;
  album: AlbumModel;

  updated_at: Date;
  created_at: Date;
}

export class CreateChannelModel extends PickType(ChannelModel, [
  'member_ids',
] as const) {}

export class ChannelSimpleModel extends PickType(ChannelModel, [
  '_id',
  'member_ids',
  'couple_info',
  'members',
  'message_channel',
] as const) {}
