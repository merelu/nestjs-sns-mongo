import { PickType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';
import { FeedSimpleModel } from './feed';
export class AlbumModel {
  _id: Types.ObjectId;
  channel_id: Types.ObjectId;
  feed_ids: Types.ObjectId[];

  feeds: FeedSimpleModel[];

  created_at: Date;
  udpated_at: Date;
}

export class CreateAlbumModel extends PickType(AlbumModel, [
  'channel_id',
] as const) {}
