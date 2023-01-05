import { PickType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';

export class CoupleInfoModel {
  _id: Types.ObjectId;
  channel_id: Types.ObjectId;
  anniversaries: AnniversaryModel[];
  love_day: Date;

  created_at: Date;
  updated_at: Date;
}

export class AnniversaryModel {
  _id: Types.ObjectId;
  name: string;
  datetime: Date;

  created_at: Date;
  updated_at: Date;
}

export class CreateCoupleInfoModel extends PickType(CoupleInfoModel, [
  'channel_id',
] as const) {}

export class CoupleInfoSimpleModel extends PickType(CoupleInfoModel, [
  '_id',
  'anniversaries',
  'love_day',
] as const) {}

export class AddAnniversaryModel extends PickType(AnniversaryModel, [
  'name',
  'datetime',
] as const) {}
