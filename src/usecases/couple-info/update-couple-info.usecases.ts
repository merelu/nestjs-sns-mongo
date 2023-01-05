import { AddAnniversaryModel } from '@domain/model/database/couple-info';
import { ICoupleInfoRepository } from '@domain/repositories/couple-info.repository.interface';
import { Types } from 'mongoose';

export class UpdateCoupleInfoUseCases {
  constructor(private readonly coupleInfoRepository: ICoupleInfoRepository) {}

  async updateLoveDay(channelId: Types.ObjectId, loveDay: Date) {
    return await this.coupleInfoRepository.updateCoupleInfoByChannelId(
      channelId,
      {
        $set: { love_day: loveDay },
      },
    );
  }

  async addAnniversary(
    channelId: Types.ObjectId,
    anniversary: AddAnniversaryModel,
  ) {
    return await this.coupleInfoRepository.updateCoupleInfoByChannelId(
      channelId,
      {
        $addToSet: {
          anniversaries: anniversary,
        },
      },
    );
  }
}
