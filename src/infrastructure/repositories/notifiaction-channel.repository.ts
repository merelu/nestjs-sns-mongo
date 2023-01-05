import { SchemaNames } from '@domain/common/constants/schema-names';
import { IPagination } from '@domain/model/common/pagination';
import { AddNotificationModel } from '@domain/model/database/notification';
import {
  CreateNotificationChannelModel,
  NotificationChannelModel,
} from '@domain/model/database/notification-channel';
import { INotificationChannelRepository } from '@domain/repositories/notification-channel.repository.interface';
import {
  NotificationChannel,
  NotificationChannelDocument,
} from '@infrastructure/entities/notification-channel.entity';
import { Notification } from '@infrastructure/entities/notification.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types, PipelineStage } from 'mongoose';

@Injectable()
export class DatabaseNotificationChannelRepository
  implements INotificationChannelRepository
{
  constructor(
    @InjectModel(SchemaNames.notificationChannel)
    private readonly notificationChannelEntityRepository: Model<NotificationChannelDocument>,
  ) {}

  async insert(
    data: CreateNotificationChannelModel,
    session?: ClientSession,
  ): Promise<NotificationChannelModel> {
    const entity = this.toNotificationChannelEntity(data);
    const [result] = await this.notificationChannelEntityRepository.create(
      [entity],
      { session },
    );

    return result;
  }

  async findByUserId(
    userId: Types.ObjectId,
  ): Promise<NotificationChannelModel | null> {
    const result = await this.notificationChannelEntityRepository.findOne({
      user_id: userId,
    });
    if (!result) {
      return null;
    }

    return this.toNotificationChannel(result);
  }

  async addNotification(
    userId: Types.ObjectId,
    data: AddNotificationModel,
    session?: ClientSession,
  ): Promise<void> {
    await this.notificationChannelEntityRepository.findOneAndUpdate(
      { user_id: userId },
      {
        $addToSet: this.toNotificationEntity(data),
      },
      { session },
    );
  }

  async updateNotificationRead(
    userId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<void> {
    await this.notificationChannelEntityRepository.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        $set: {
          'notifications.$[i].read': true,
        },
      },
      { arrayFilters: [{ 'i.read': false }], session },
    );
  }

  async aggregateNotificationsByPagination(
    userId: Types.ObjectId,
    pagination: IPagination,
  ): Promise<NotificationChannelModel> {
    //추후 채크 필요
    const pipelines: PipelineStage[] = [
      {
        $match: {
          user_id: userId,
        },
      },
      {
        $project: {
          notifications: {
            $reverseArray: {
              $slice: [
                {
                  $filter: {
                    input: '$notifications',
                    as: 'item',
                    cond: { created_at: { $lte: pagination.requested_at } },
                  },
                },
                -pagination.page * pagination.size,
                pagination.size,
              ],
            },
          },
        },
      },
    ];
    const [result] =
      await this.notificationChannelEntityRepository.aggregate<NotificationChannelModel>(
        pipelines,
      );

    return result;
  }

  private toNotificationChannel(doc: NotificationChannelDocument) {
    const result = new NotificationChannelModel();
    result._id = doc._id;
    result.user_id = doc.user_id;
    result.notifications = doc.notifications;
    result.created_at = doc.created_at;
    result.updated_at = doc.updated_at;

    return result;
  }

  private toNotificationChannelEntity(data: CreateNotificationChannelModel) {
    const result = new NotificationChannel();

    result.user_id = data.user_id;

    return result;
  }

  private toNotificationEntity(data: AddNotificationModel) {
    const result = new Notification();

    result.title = data.title;
    result.body = data.body;
    result.event_type = data.event_type;

    return result;
  }
}
