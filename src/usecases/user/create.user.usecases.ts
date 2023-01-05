import { DevicePlatformEnum } from '@domain/common/enums/device-platform';
import { AuthTypeEnum } from '@domain/common/enums/user/auth-type.enum';
import { OAuthPayload } from '@domain/model/common/oauth-payload';
import { AddDeviceInfoModel } from '@domain/model/database/device-info';
import { ImageModel } from '@domain/model/database/image';
import {
  CreateNotificationChannelModel,
  NotificationChannelModel,
} from '@domain/model/database/notification-channel';
import { CreateUserModel, UserModel } from '@domain/model/database/user';
import { INotificationChannelRepository } from '@domain/repositories/notification-channel.repository.interface';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { ClientSession, Types } from 'mongoose';

export class CreateUserUseCases {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly notificationChannelRepository: INotificationChannelRepository,
  ) {}

  async createUser(
    data: OAuthPayload,
    device_token: string,
    platform: DevicePlatformEnum,
    session?: ClientSession,
  ) {
    const newUser = new CreateUserModel();

    newUser.email = data.profile.email;
    newUser.auth_type = data.auth_type;
    newUser.oauth_user_id = data.id;

    newUser.gender_type = data.profile.gender_type;
    newUser.birthday = data.profile.birthday;
    newUser.name = data.profile.name;
    newUser.profile_image = this.toImageModel(data.profile.profile_image_url);

    const newDeviceInfo = new AddDeviceInfoModel();
    newDeviceInfo.device_token = device_token;
    newDeviceInfo.device_token_timestamp = Date.now();
    newDeviceInfo.platform = platform;

    newUser.device_info = newDeviceInfo;

    const result = await this.userRepository.insert(newUser, session);
    await this.createNotificationChannel(result._id, session);
    return result;
  }

  async checkMachedOAuthUser(
    providerUserId: string,
    provider: AuthTypeEnum,
  ): Promise<UserModel | null> {
    return await this.userRepository.getUserByOAuthPayload(
      provider,
      providerUserId,
    );
  }

  private async createNotificationChannel(
    userId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<NotificationChannelModel> {
    const newNotificationChannel = new CreateNotificationChannelModel();
    newNotificationChannel.user_id = userId;

    return await this.notificationChannelRepository.insert(
      newNotificationChannel,
      session,
    );
  }

  private toImageModel(url?: string): ImageModel | null {
    if (!url) return null;

    const result = new ImageModel();
    result.url = url;

    return result;
  }
}
