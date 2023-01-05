import { ChannelModel } from '@domain/model/database/channel';
import { IChannelRepository } from '@domain/repositories/channel.repository.interface';
import { Types } from 'mongoose';

export class GetChannelUseCases {
  constructor(private readonly channelRepository: IChannelRepository) {}

  async excute(channelId: Types.ObjectId): Promise<ChannelModel | null> {
    return await this.channelRepository.findByIdAndPopulate(channelId);
  }
}
