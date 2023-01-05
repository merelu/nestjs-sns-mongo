import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';
import { IException } from '@domain/exceptions/exceptions.interface';
import { IAlbumRepository } from '@domain/repositories/album.repository.interface';
import { IFeedRepository } from '@domain/repositories/feed.repository.interface';
import dayjs from 'dayjs';
import { ClientSession, Types } from 'mongoose';

export class DeleteFeedUseCases {
  constructor(
    private readonly feedRepository: IFeedRepository,
    private readonly albumRepository: IAlbumRepository,
    private readonly exceptionService: IException,
  ) {}

  async execute(feedId: Types.ObjectId, session?: ClientSession) {
    await this.feedRepository.updateFeedByUpdateQuery(
      feedId,
      {
        $set: { deleted: true, deleted_at: dayjs().toDate() },
      },
      session,
    );
  }

  async permissionCheck(
    feedId: Types.ObjectId,
    channelId: Types.ObjectId,
  ): Promise<void> {
    const result = await this.feedRepository.findById(feedId);

    if (result && !result.channel_id.equals(channelId)) {
      throw this.exceptionService.forbiddenException({
        error_description: '수정 권한이 없는 유저입니다.',
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
      });
    }
  }

  async deleteFeedInAlbum(
    channelId: Types.ObjectId,
    feedId: Types.ObjectId,
    session?: ClientSession,
  ) {
    await this.albumRepository.updateAlbumByUpdatedQuery(
      channelId,
      {
        $pull: {
          feed_ids: feedId,
        },
      },
      session,
    );
  }
}
