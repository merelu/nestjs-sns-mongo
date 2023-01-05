import { DEFAULT_PAGINATION_SIZE } from '@domain/common/constants/pagination.constants';
import { IPagination } from '@domain/model/common/pagination';
import { NotificationModel } from '@domain/model/database/notification';
import { INotificationChannelRepository } from '@domain/repositories/notification-channel.repository.interface';
import dayjs from 'dayjs';
import { Types } from 'mongoose';

export class GetNotificationUseCases {
  constructor(
    private readonly notificationChannelRepository: INotificationChannelRepository,
  ) {}

  async getNotificationsByPagination(
    userId: Types.ObjectId,
    pagination: IPagination,
  ): Promise<NotificationModel[]> {
    await this.notificationChannelRepository.updateNotificationRead(userId);

    const result =
      await this.notificationChannelRepository.aggregateNotificationsByPagination(
        userId,
        {
          page: pagination.page ? pagination.page : 0,
          size: pagination.size ? pagination.size : DEFAULT_PAGINATION_SIZE,
          requested_at: pagination.requested_at
            ? pagination.requested_at
            : dayjs().toDate(),
        },
      );
    if (!result) {
      return [];
    }

    return result.notifications;
  }
}
