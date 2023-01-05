import { DEFAULT_PAGINATION_SIZE } from '@domain/common/constants/pagination.constants';
import { IPagination } from '@domain/model/common/pagination';
import { AlbumModel } from '@domain/model/database/album';
import { IAlbumRepository } from '@domain/repositories/album.repository.interface';
import dayjs from 'dayjs';
import { Types } from 'mongoose';

export class GetAlbumUseCases {
  constructor(private readonly albumRepository: IAlbumRepository) {}

  async getAlbumByFeedPagination(
    channelId: Types.ObjectId,
    pagination: IPagination,
  ): Promise<AlbumModel> {
    return await this.albumRepository.aggregateAlbumFeedsByPagination(
      channelId,
      {
        page: pagination.page ? pagination.page : 0,
        size: pagination.size ? pagination.size : DEFAULT_PAGINATION_SIZE,
        requested_at: pagination.requested_at
          ? pagination.requested_at
          : dayjs().toDate(),
      },
    );
  }
}
