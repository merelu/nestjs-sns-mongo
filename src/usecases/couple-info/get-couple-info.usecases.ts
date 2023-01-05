import { ICoupleInfoRepository } from '@domain/repositories/couple-info.repository.interface';
import { Types } from 'mongoose';

export class GetCoupleInfoUseCases {
  constructor(private readonly coupleInfoRepository: ICoupleInfoRepository) {}

  async getCoupleInfoByChannelId(channelId: Types.ObjectId) {
    return await this.coupleInfoRepository.findByChannelId(channelId);
  }
}
