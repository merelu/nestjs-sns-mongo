import { SchemaNames } from '@domain/common/constants/schema-names';
import { AccessTypeEnum } from '@domain/common/enums/feed/access-type.enum';
import { IPagination } from '@domain/model/common/pagination';
import { CreateFeedModel, FeedModel } from '@domain/model/database/feed';
import { IFeedRepository } from '@domain/repositories/feed.repository.interface';
import { Feed, FeedDocument } from '@infrastructure/entities/feed.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession } from 'mongodb';
import { Model, PipelineStage, Types, UpdateQuery } from 'mongoose';

@Injectable()
export class DatabaseFeedRepository implements IFeedRepository {
  constructor(
    @InjectModel(SchemaNames.feed)
    private readonly feedEntityRepository: Model<FeedDocument>,
  ) {}

  async insert(
    data: CreateFeedModel,
    session?: ClientSession,
  ): Promise<FeedModel> {
    const entity = this.toFeedEntity(data);
    let [result] = await this.feedEntityRepository.create([entity], {
      session,
    });

    result = await result.populate(['writer']);

    return this.toFeed(result);
  }

  async updateFeedImages(
    feedId: Types.ObjectId,
    imageUris: string[],
    session?: ClientSession,
  ): Promise<void> {
    await this.feedEntityRepository.findByIdAndUpdate(
      feedId,
      {
        $addToSet: { image_uris: imageUris },
      },
      { session },
    );
  }

  async findByIdAndPopulate(feedId: Types.ObjectId): Promise<FeedModel | null> {
    const result = await this.feedEntityRepository
      .findById(feedId)
      .populate(['writer']);

    if (!result) {
      return null;
    }
    return this.toFeed(result);
  }

  async aggregateFeedsByPagination(
    pagination: IPagination,
  ): Promise<FeedModel[]> {
    const pipelines: PipelineStage[] = [
      {
        $match: {
          access_type: AccessTypeEnum.public,
          deleted: false,
          created_at: { $lte: pagination.requested_at },
        },
      },
      { $sort: { created_at: -1 } },
      { $skip: pagination.page * pagination.size },
      { $limit: pagination.size },
      {
        $lookup: {
          from: 'users',
          localField: 'writer_id',
          foreignField: '_id',
          as: 'writer',
        },
      },
      {
        $unwind: { path: '$writer', preserveNullAndEmptyArrays: true },
      },
    ];

    return await this.feedEntityRepository.aggregate<FeedModel>(pipelines);
  }

  async findById(feedId: Types.ObjectId): Promise<FeedModel | null> {
    const result = await this.feedEntityRepository.findById(feedId);

    if (!result) {
      return null;
    }
    return this.toFeed(result);
  }

  async updateFeedByUpdateQuery(
    feedId: Types.ObjectId,
    query: UpdateQuery<FeedModel>,
    session?: ClientSession,
  ): Promise<void> {
    await this.feedEntityRepository.findByIdAndUpdate(feedId, query, {
      session,
    });
  }

  async updateFeedLike(
    feedId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    await this.feedEntityRepository.findByIdAndUpdate(feedId, {
      $addToSet: {
        liker_ids: userId,
      },
    });
  }
  async updateFeedRemoveLike(
    feedId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    await this.feedEntityRepository.findByIdAndUpdate(feedId, {
      $pull: {
        liker_ids: userId,
      },
    });
  }

  private toFeed(doc: FeedDocument): FeedModel {
    const result = new FeedModel();
    result._id = doc._id;
    result.writer_id = doc.writer_id;
    result.channel_id = doc.channel_id;
    result.access_type = doc.access_type;
    result.photos = doc.photos;
    result.content = doc.content;
    result.dating_date = doc.dating_date;
    result.deleted = doc.deleted;
    result.deleted_at = doc.deleted_at;
    result.writer = doc.writer;
    result.created_at = doc.created_at;
    result.updated_at = doc.updated_at;
    result.liker_ids = doc.liker_ids;

    return result;
  }

  private toFeedEntity(data: CreateFeedModel): Feed {
    const result = new Feed();

    result.channel_id = data.channel_id;
    result.writer_id = data.writer_id;
    result.access_type = data.access_type;
    result.content = data.content;
    result.dating_date = data.dating_date;
    result.photos = data.photos;

    return result;
  }
}
