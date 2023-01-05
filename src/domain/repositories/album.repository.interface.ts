import { IPagination } from '@domain/model/common/pagination';
import { AlbumModel, CreateAlbumModel } from '@domain/model/database/album';
import { ClientSession, Types, UpdateQuery } from 'mongoose';

export interface IAlbumRepository {
  insert(data: CreateAlbumModel, session?: ClientSession): Promise<AlbumModel>;

  updateAlbumFeed(
    channelId: Types.ObjectId,
    feedId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<void>;

  updateAlbumByUpdatedQuery(
    channelId: Types.ObjectId,
    query: UpdateQuery<AlbumModel>,
    session?: ClientSession,
  ): Promise<void>;

  aggregateAlbumFeedsByPagination(
    channelId: Types.ObjectId,
    pagination: IPagination,
  ): Promise<AlbumModel>;
}
