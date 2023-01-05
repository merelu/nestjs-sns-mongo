import {
  ChannelModel,
  CreateChannelModel,
} from '@domain/model/database/channel';
import { ClientSession, Types } from 'mongoose';

export interface IChannelRepository {
  insert(
    data: CreateChannelModel,
    session?: ClientSession,
  ): Promise<ChannelModel>;

  findById(channelId: Types.ObjectId): Promise<ChannelModel | null>;

  findByIdAndPopulate(channelId: Types.ObjectId): Promise<ChannelModel | null>;

  findChannelByUserId(userId: Types.ObjectId): Promise<ChannelModel[]>;

  findChannelbyMemberIds(
    memberIds: Types.ObjectId[],
  ): Promise<ChannelModel | null>;
}
