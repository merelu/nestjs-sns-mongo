import { SchemaNames } from '@domain/common/constants/schema-names';
import {
  CreateCoupleInfoModel,
  CoupleInfoModel,
} from '@domain/model/database/couple-info';
import { ICoupleInfoRepository } from '@domain/repositories/couple-info.repository.interface';
import {
  CoupleInfo,
  CoupleInfoDocument,
} from '@infrastructure/entities/couple-info.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession } from 'mongodb';
import { Model, Types, UpdateQuery } from 'mongoose';

@Injectable()
export class DatabaseCoupleInfoRepository implements ICoupleInfoRepository {
  constructor(
    @InjectModel(SchemaNames.coupleInfo)
    private readonly coupleInfoEntityRepository: Model<CoupleInfoDocument>,
  ) {}

  async insert(
    data: CreateCoupleInfoModel,
    session?: ClientSession,
  ): Promise<CoupleInfoModel> {
    const entity = this.toCoupleInfoEntity(data);
    const [result] = await this.coupleInfoEntityRepository.create([entity], {
      session,
    });

    return this.toCoupleInfo(result);
  }

  async findById(
    coupleInfoId: Types.ObjectId,
  ): Promise<CoupleInfoModel | null> {
    const result = await this.coupleInfoEntityRepository.findById(coupleInfoId);

    if (!result) {
      return null;
    }

    return this.toCoupleInfo(result);
  }

  async findByChannelId(
    channelId: Types.ObjectId,
  ): Promise<CoupleInfoModel | null> {
    const result = await this.coupleInfoEntityRepository.findOne({
      channel_id: channelId,
    });

    if (!result) {
      return null;
    }

    return this.toCoupleInfo(result);
  }

  async updateCoupleInfoByChannelId(
    channelId: Types.ObjectId,
    updated: UpdateQuery<CoupleInfoDocument>,
    session?: ClientSession,
  ): Promise<CoupleInfoModel | null> {
    const result = await this.coupleInfoEntityRepository.findOneAndUpdate(
      { channel_id: channelId },
      updated,
      { session, new: true },
    );
    if (!result) {
      return null;
    }
    return this.toCoupleInfo(result);
  }

  private toCoupleInfo(doc: CoupleInfoDocument): CoupleInfoModel {
    const result = new CoupleInfoModel();

    result._id = doc._id;
    result.channel_id = doc.channel_id;
    result.anniversaries = doc.anniversaries;
    result.love_day = doc.love_day;
    result.created_at = doc.created_at;
    result.updated_at = doc.updated_at;

    return result;
  }

  private toCoupleInfoEntity(data: CreateCoupleInfoModel): CoupleInfo {
    const result = new CoupleInfo();

    result.channel_id = data.channel_id;

    return result;
  }
}
