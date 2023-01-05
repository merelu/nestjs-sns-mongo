import { SchemaNames } from '@domain/common/constants/schema-names';
import {
  ChannelModel,
  CreateChannelModel,
} from '@domain/model/database/channel';
import { IChannelRepository } from '@domain/repositories/channel.repository.interface';
import {
  Channel,
  ChannelDocument,
} from '@infrastructure/entities/channel.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession } from 'mongodb';
import { Model, Types } from 'mongoose';

@Injectable()
export class DatabaseChannelRepository implements IChannelRepository {
  constructor(
    @InjectModel(SchemaNames.channel)
    private readonly channelEntityRepository: Model<ChannelDocument>,
  ) {}
  async insert(
    data: CreateChannelModel,
    session?: ClientSession,
  ): Promise<ChannelModel> {
    const entity = this.toChannelEntity(data);
    let [result] = await this.channelEntityRepository.create([entity], {
      session,
    });
    result = await result.populate('members');

    return this.toChannel(result);
  }
  async findById(channelId: Types.ObjectId): Promise<ChannelModel | null> {
    const result = await this.channelEntityRepository.findById(channelId);

    if (!result) {
      return null;
    }

    return this.toChannel(result);
  }

  async findByIdAndPopulate(
    channelId: Types.ObjectId,
  ): Promise<ChannelModel | null> {
    const result = await this.channelEntityRepository
      .findById(channelId)
      .populate(['members', 'couple_info', 'message_channel']);

    if (!result) {
      return null;
    }
    return this.toChannel(result);
  }

  async findChannelByUserId(userId: Types.ObjectId): Promise<ChannelModel[]> {
    const result = await this.channelEntityRepository.find({
      member_ids: userId,
    });

    return result.map((i) => this.toChannel(i));
  }

  async findChannelbyMemberIds(
    memberIds: Types.ObjectId[],
  ): Promise<ChannelModel | null> {
    const result = await this.channelEntityRepository.findOne({
      member_ids: { $in: memberIds },
    });

    if (!result) {
      return null;
    }

    return this.toChannel(result);
  }

  private toChannel(doc: ChannelDocument): ChannelModel {
    const result = new ChannelModel();
    result._id = doc._id;
    result.member_ids = doc.member_ids;
    result.members = doc.members;
    result.message_channel = doc.message_channel;
    result.couple_info = doc.couple_info;
    result.created_at = doc.created_at;
    result.updated_at = doc.updated_at;

    return result;
  }

  private toChannelEntity(data: CreateChannelModel): Channel {
    const result = new Channel();

    result.member_ids = data.member_ids;

    return result;
  }
}
