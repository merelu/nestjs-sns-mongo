import { SchemaNames } from '@domain/common/constants/schema-names';
import { IPagination } from '@domain/model/common/pagination';
import { CreateAlbumModel, AlbumModel } from '@domain/model/database/album';
import { IAlbumRepository } from '@domain/repositories/album.repository.interface';
import { Album, AlbumDocument } from '@infrastructure/entities/album.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession } from 'mongodb';
import { Model, PipelineStage, Types, UpdateQuery } from 'mongoose';

@Injectable()
export class DatabaseAlbumRepository implements IAlbumRepository {
  constructor(
    @InjectModel(SchemaNames.album)
    private readonly albumEntityRepository: Model<AlbumDocument>,
  ) {}

  async updateAlbumByUpdatedQuery(
    channelId: Types.ObjectId,
    query: UpdateQuery<AlbumModel>,
    session?: ClientSession,
  ): Promise<void> {
    await this.albumEntityRepository.findOneAndUpdate(
      { channel_id: channelId },
      query,
      { session },
    );
  }
  async aggregateAlbumFeedsByPagination(
    channelId: Types.ObjectId,
    pagination: IPagination,
  ): Promise<AlbumModel> {
    const pipelines: PipelineStage[] = [
      { $match: { channel_id: channelId } },
      {
        $lookup: {
          from: 'feeds',
          localField: 'feed_ids',
          foreignField: '_id',
          pipeline: [
            {
              $match: {
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
            { $unwind: { path: '$writer', preserveNullAndEmptyArrays: true } },
          ],
          as: 'feeds',
        },
      },
      { $project: { feeds: 1 } },
    ];

    const [result] = await this.albumEntityRepository.aggregate<AlbumModel>(
      pipelines,
    );

    return result;
  }

  async insert(
    data: CreateAlbumModel,
    session?: ClientSession,
  ): Promise<AlbumModel> {
    const entity = this.toAlbumEntity(data);
    const [result] = await this.albumEntityRepository.create([entity], {
      session,
    });

    return this.toAlbum(result);
  }

  async updateAlbumFeed(
    channelId: Types.ObjectId,
    feedId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<void> {
    await this.albumEntityRepository.findOneAndUpdate(
      {
        channel_id: channelId,
      },
      {
        $addToSet: {
          feed_ids: feedId,
        },
      },
      { session },
    );
  }

  private toAlbum(doc: AlbumDocument): AlbumModel {
    const result = new AlbumModel();

    result._id = doc._id;
    result.channel_id = doc.channel_id;
    result.feed_ids = doc.feed_ids;
    result.feeds = doc.feeds;
    result.created_at = doc.created_at;
    result.udpated_at = doc.updated_at;

    return result;
  }

  private toAlbumEntity(data: CreateAlbumModel): Album {
    const result = new Album();

    result.channel_id = data.channel_id;

    return result;
  }
}
