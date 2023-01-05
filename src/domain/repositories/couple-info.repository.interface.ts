import {
  CoupleInfoModel,
  CreateCoupleInfoModel,
} from '@domain/model/database/couple-info';
import { CoupleInfoDocument } from '@infrastructure/entities/couple-info.entity';
import { ClientSession, Types, UpdateQuery } from 'mongoose';

export interface ICoupleInfoRepository {
  insert(
    data: CreateCoupleInfoModel,
    session?: ClientSession,
  ): Promise<CoupleInfoModel>;

  findById(coupleInfoId: Types.ObjectId): Promise<CoupleInfoModel | null>;

  findByChannelId(channelId: Types.ObjectId): Promise<CoupleInfoModel | null>;

  updateCoupleInfoByChannelId(
    channelId: Types.ObjectId,
    updated: UpdateQuery<CoupleInfoDocument>,
    session?: ClientSession,
  ): Promise<CoupleInfoModel | null>;
}
