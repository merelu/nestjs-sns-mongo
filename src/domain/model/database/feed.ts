import { AccessTypeEnum } from '@domain/common/enums/feed/access-type.enum';
import { PickType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';
import { ImageModel } from './image';
import { UserSimpleModel } from './user';
export class FeedModel {
  _id: Types.ObjectId;
  channel_id: Types.ObjectId;
  writer_id: Types.ObjectId;
  access_type: AccessTypeEnum;
  photos: ImageModel[];
  content: string;
  dating_date: Date;
  liker_ids: Types.ObjectId[];

  writer: UserSimpleModel;

  deleted: boolean;
  deleted_at: Date;

  updated_at: Date;
  created_at: Date;
}

export class CreateFeedModel extends PickType(FeedModel, [
  'channel_id',
  'writer_id',
  'access_type',
  'content',
  'dating_date',
  'photos',
] as const) {}

export class FeedSimpleModel extends PickType(FeedModel, [
  '_id',
  'writer',
  'access_type',
  'photos',
  'content',
  'dating_date',
  'liker_ids',
]) {}
