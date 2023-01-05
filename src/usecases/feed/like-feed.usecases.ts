import { IFeedRepository } from '@domain/repositories/feed.repository.interface';
import { Types } from 'mongoose';

export class LikeFeedUseCases {
  constructor(private readonly feedRepository: IFeedRepository) {}

  async like(feedId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
    await this.feedRepository.updateFeedLike(feedId, userId);
  }

  async removeLike(
    feedId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    await this.feedRepository.updateFeedRemoveLike(feedId, userId);
  }
}
