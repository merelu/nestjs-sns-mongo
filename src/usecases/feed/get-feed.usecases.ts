import { DEFAULT_PAGINATION_SIZE } from '@domain/common/constants/pagination.constants';
import { IPagination } from '@domain/model/common/pagination';
import { FeedModel } from '@domain/model/database/feed';
import { IFeedRepository } from '@domain/repositories/feed.repository.interface';
import dayjs from 'dayjs';
import { Types } from 'mongoose';

export class GetFeedUseCases {
  constructor(private readonly feedRepository: IFeedRepository) {}

  async getFeed(feedId: Types.ObjectId): Promise<FeedModel | null> {
    return await this.feedRepository.findByIdAndPopulate(feedId);
  }

  async getFeedsByPagination(pagination: IPagination) {
    return await this.feedRepository.aggregateFeedsByPagination({
      page: pagination.page ? pagination.page : 0,
      size: pagination.size ? pagination.size : DEFAULT_PAGINATION_SIZE,
      requested_at: pagination.requested_at
        ? pagination.requested_at
        : dayjs().toDate(),
    });
  }
}
