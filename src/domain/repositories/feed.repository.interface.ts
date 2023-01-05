import { IPagination } from '@domain/model/common/pagination';
import { CreateFeedModel, FeedModel } from '@domain/model/database/feed';
import { ClientSession, Types, UpdateQuery } from 'mongoose';

export interface IFeedRepository {
  insert(data: CreateFeedModel, session?: ClientSession): Promise<FeedModel>;

  updateFeedImages(
    feedId: Types.ObjectId,
    imageUris: string[],
    session?: ClientSession,
  ): Promise<void>;

  findById(feedId: Types.ObjectId): Promise<FeedModel | null>;

  findByIdAndPopulate(feedId: Types.ObjectId): Promise<FeedModel | null>;

  updateFeedLike(feedId: Types.ObjectId, userId: Types.ObjectId): Promise<void>;

  updateFeedRemoveLike(
    feedId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void>;

  updateFeedByUpdateQuery(
    feedId: Types.ObjectId,
    query: UpdateQuery<FeedModel>,
    session?: ClientSession,
  ): Promise<void>;

  aggregateFeedsByPagination(pagination: IPagination): Promise<FeedModel[]>;
}
