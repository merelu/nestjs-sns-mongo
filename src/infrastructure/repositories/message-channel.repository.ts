import { SchemaNames } from '@domain/common/constants/schema-names';
import { IPagination } from '@domain/model/common/pagination';
import { MessageModel } from '@domain/model/database/message';
import {
  MessageChannelModel,
  CreateMessageChannelModel,
} from '@domain/model/database/message-channel';
import { IMessageChannelRepository } from '@domain/repositories/message-channel.repository.interface';
import {
  MessageChannel,
  MessageChannelDocument,
} from '@infrastructure/entities/message-channel.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ClientSession,
  FilterQuery,
  Model,
  PipelineStage,
  Types,
  UpdateQuery,
} from 'mongoose';

@Injectable()
export class DatabaseMessageChannelRepository
  implements IMessageChannelRepository
{
  constructor(
    @InjectModel(SchemaNames.messageChannel)
    private readonly messageChannelEntityRepository: Model<MessageChannelDocument>,
  ) {}

  async insert(
    data: CreateMessageChannelModel,
    session?: ClientSession,
  ): Promise<MessageChannelModel> {
    const entity = this.toChannelEntity(data);
    const [result] = await this.messageChannelEntityRepository.create(
      [entity],
      {
        session,
      },
    );

    return this.toChannel(result);
  }

  async findChannelByQuery(
    query: FilterQuery<MessageChannelDocument>,
  ): Promise<MessageChannelModel | null> {
    const result = await this.messageChannelEntityRepository.findOne(query);
    if (!result) {
      return null;
    }
    return this.toChannel(result);
  }

  async findOneByChannelId(
    channelId: Types.ObjectId,
  ): Promise<MessageChannelModel | null> {
    const result = await this.messageChannelEntityRepository.findOne({
      channel_id: channelId,
    });

    if (!result) {
      return null;
    }

    return this.toChannel(result);
  }

  async findOneByChannelIdAndPopulate(
    channelId: Types.ObjectId,
  ): Promise<MessageChannelModel | null> {
    const result = await this.messageChannelEntityRepository
      .findOne({ channel_id: channelId })
      .populate(['members', 'last_message']);

    if (!result) {
      return null;
    }
    return this.toChannel(result);
  }

  async updateMessageChannelByQuery(
    channelId: Types.ObjectId,
    updateQuery: UpdateQuery<MessageChannelModel>,
    session?: ClientSession,
  ): Promise<void> {
    await this.messageChannelEntityRepository.findOneAndUpdate(
      { channel_id: channelId },
      updateQuery,
      { session },
    );
  }

  async aggregateMessagesByPagination(
    channelId: Types.ObjectId,
    pagination: IPagination,
  ): Promise<MessageModel[]> {
    const pipelines: PipelineStage[] = [
      {
        $match: {
          channel_id: channelId,
        },
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'message_ids',
          foreignField: '_id',
          pipeline: [
            {
              $match: {
                created_at: { $lte: pagination.requested_at },
              },
            },
            { $sort: { created_at: -1 } },
            { $skip: pagination.page * pagination.size },
            { $limit: pagination.size },
          ],
          as: 'messages',
        },
      },
    ];
    const [result] =
      await this.messageChannelEntityRepository.aggregate<MessageChannelModel>(
        pipelines,
      );

    if (!result) {
      return [];
    }

    return result.messages;
  }

  private toChannel(doc: MessageChannelDocument): MessageChannelModel {
    const result = new MessageChannelModel();

    result._id = doc._id;
    result.channel_id = doc.channel_id;
    result.message_ids = doc.message_ids;
    result.last_message_id = doc.last_message_id;
    result.last_message_updated_at = doc.last_message_updated_at;

    result.created_at = doc.created_at;
    result.updated_at = doc.updated_at;

    result.messages = doc.messages;
    result.last_message = doc.last_message;

    return result;
  }

  private toChannelEntity(data: CreateMessageChannelModel): MessageChannel {
    const result: MessageChannel = new MessageChannel();

    result.channel_id = data.channel_id;

    return result;
  }
}
