import { INotificationChannelRepository } from '@domain/repositories/notification-channel.repository.interface';

export class PushNotificationUseCases {
  constructor(
    private readonly notificationChannelRepository: INotificationChannelRepository,
  ) {}
}
