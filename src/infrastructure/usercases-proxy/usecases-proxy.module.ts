import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { ExceptionsModule } from '@infrastructure/services/exceptions/exceptions.module';
import { ExceptionsService } from '@infrastructure/services/exceptions/exceptions.service';
import { LoggerModule } from '@infrastructure/services/logger/logger.module';
import { DatabaseMessageChannelRepository } from '@infrastructure/repositories/message-channel.repository';
import { DatabaseMessageRepository } from '@infrastructure/repositories/message.repository';
import { RepositoriesModule } from '@infrastructure/repositories/repositories.module';
import { DatabaseUserRepository } from '@infrastructure/repositories/user.repository';
import { BcryptServiceModule } from '@infrastructure/services/bcrypt/bcrypt.module';
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service';
import { JwtServiceModule } from '@infrastructure/services/jwt/jwt.module';
import { JwtTokenService } from '@infrastructure/services/jwt/jwt.service';
import { DynamicModule, Module } from '@nestjs/common';
import { LoginUseCases } from '@usecases/auth/login.usecases';
import { LogoutUseCases } from '@usecases/auth/logout.usecases';
import { CreateMessageUseCases } from '@usecases/chat/create-message.usecases';
import { UseCaseProxy } from './usecases-proxy';
import { RedisCacheService } from '@infrastructure/services/redis-cache/redis-cache.service';
import { RedisCacheModule } from '@infrastructure/services/redis-cache/redis-cache.module';
import { GoogleAuthService } from '@infrastructure/services/google/google-auth.service';
import { GoogleModule } from '@infrastructure/services/google/google.module';
import { AppleAuthService } from '@infrastructure/services/apple/apple-auth.service';
import { AppleModule } from '@infrastructure/services/apple/apple.module';
import { DatabaseChannelRepository } from '@infrastructure/repositories/channel.repository';
import { CreateChannelUseCases } from '@usecases/channel/create-channel.usecases';
import { DatabaseCoupleInfoRepository } from '@infrastructure/repositories/couple-info.repository';
import { UpdateCoupleInfoUseCases } from '@usecases/couple-info/update-couple-info.usecases';
import { CreateFeedUseCases } from '@usecases/feed/create-feed.usecases';
import { DatabaseFeedRepository } from '@infrastructure/repositories/feed.repository';
import { AwsService } from '@infrastructure/services/aws/aws.service';
import { AwsModule } from '@infrastructure/services/aws/aws.module';
import { DatabaseAlbumRepository } from '@infrastructure/repositories/album.repository';
import { GetChannelUseCases } from '@usecases/channel/get-channel.usecases';
import { GenerateCoupleCodeUseCases } from '@usecases/couple-code/generate.usecases';
import { GoogleOAuthUseCases } from '@usecases/auth/google-oauth.usecases';
import { AppleOAuthUseCases } from '@usecases/auth/apple-oauth.usecases';
import { PresignedFeedImageUseCases } from '@usecases/feed/presigned-feed-image.usecases';
import { CreateFeedUploadUseCases } from '@usecases/feed/create-feed-upload.usecases';
import { GetFeedUseCases } from '@usecases/feed/get-feed.usecases';
import { GetAlbumUseCases } from '@usecases/album/get.album.usecases';
import { LikeFeedUseCases } from '@usecases/feed/like-feed.usecases';
import { UpdateFeedUseCases } from '@usecases/feed/update.feed.usecases';
import { DeleteFeedUseCases } from '@usecases/feed/delete.feed.usecases';
import { UpdateUserUseCases } from '@usecases/user/update-user.usecases';
import { WithdrawUserUseCases } from '@usecases/user/withdraw-user.usecases';
import { KakaoAuthService } from '@infrastructure/services/kakao/kakao-auth.service';
import { KakaoOAuthUseCases } from '@usecases/auth/kakao-oauth.usecases';
import { KakaoModule } from '@infrastructure/services/kakao/kakao.module';
import { GetCoupleInfoUseCases } from '@usecases/couple-info/get-couple-info.usecases';
import { CreateUserUseCases } from '@usecases/user/create.user.usecases';
import { DatabaseNotificationChannelRepository } from '@infrastructure/repositories/notifiaction-channel.repository';
import { GetNotificationUseCases } from '@usecases/notification/get-notification.usecases';
import { FirebaseModule } from '@infrastructure/services/firebase/firebase.module';
import { GetMessagesUseCases } from '@usecases/chat/get-messages.usecases';

@Module({
  imports: [
    LoggerModule,
    JwtServiceModule,
    BcryptServiceModule,
    GoogleModule,
    AppleModule,
    KakaoModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionsModule,
    RedisCacheModule,
    AwsModule,
    FirebaseModule,
  ],
})
export class UseCasesProxyModule {
  static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
  static GOOGLE_OAUTH_USECASES_PROXY = 'GoogleOAuthUseCasesProxy';
  static APPLE_OAUTH_USECASES_PROXY = 'AppleOAuthUseCasesProxy';
  static KAKAO_OAUTH_USECASES_PROXY = 'KakaoOAuthUseCasesProxy';
  static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';

  static CREATE_USER_USECASES_PROXY = 'CreateUserUseCasesProxy';
  static UPDATE_USER_USECASES_PROXY = 'UpdateUserUseCasesProxy';
  static WITHDRAW_USER_USECASES_PROXY = 'WithdrawUserUseCasesProxy';

  static CREATE_CHANNEL_USECASES_PROXY = 'CreateChannelUseCasesProxy';
  static GET_CHANNEL_USECASES_PROXY = 'GetChannelUseCasesProxy';
  static GET_MESSAGES_USECASES_PROXY = 'GetMessagesUseCasesProxy';
  static CREATE_MESSAGE_USECASES_PROXY = 'CreateMessageUseCasesProxy';

  static UPDATE_COUPLE_INFO_USECASES_PROXY = 'UpdateCoupleInfoUseCasesProxy';
  static GET_COUPLE_INFO_USECASES_PROXY = 'GetCoupleInfoUseCasesProxy';

  static GET_FEED_USECASES_PROXY = 'GetFeedUseCasesProxy';
  static CREATE_FEED_USECASES_PROXY = 'CreateFeedUseCasesProxy';
  static CREATE_FEED_UPLOAD_USECASES_PROXY = 'CreateFeedUploadUseCasesProxy';
  static PRESIGNED_FEED_IMAGE_USECASES_PROXY =
    'PresignedFeedImageUseCasesProxy';
  static UPLOAD_FEED_IMAGE_USECASES_PROXY = 'UploadFeedImageUseCasesProxy';

  static LIKE_FEED_USECASES_PROXY = 'LikeFeedUseCasesProxy';
  static UPDATE_FEED_USECASES_PROXY = 'UpdateFeedUseCasesProxy';
  static DELETE_FEED_USECASES_PROXY = 'DeleteFeedUseCasesProxy';

  static GENERATE_COUPLE_CODE_USECASES_PROXY =
    'GenerateCoupleCodeUseCasesProxy';

  static GET_ALBUM_USECASES_PROXY = 'GetAlbumUseCasesProxy';

  static GET_NOTIFICATION_USECASES_PROXY = 'GetNotificationUseCasesProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyModule,
      providers: [
        {
          inject: [
            JwtTokenService,
            EnvironmentConfigService,
            DatabaseUserRepository,
            RedisCacheService,
            BcryptService,
          ],
          provide: UseCasesProxyModule.LOGIN_USECASES_PROXY,
          useFactory: (
            jwtTokenService: JwtTokenService,
            config: EnvironmentConfigService,
            userRepo: DatabaseUserRepository,
            redisCacheService: RedisCacheService,
            bcryptService: BcryptService,
          ) =>
            new UseCaseProxy(
              new LoginUseCases(
                jwtTokenService,
                config,
                userRepo,
                redisCacheService,
                bcryptService,
              ),
            ),
        },
        {
          inject: [GoogleAuthService],
          provide: UseCasesProxyModule.GOOGLE_OAUTH_USECASES_PROXY,
          useFactory: (googleAuthService: GoogleAuthService) =>
            new UseCaseProxy(new GoogleOAuthUseCases(googleAuthService)),
        },
        {
          inject: [AppleAuthService],
          provide: UseCasesProxyModule.APPLE_OAUTH_USECASES_PROXY,
          useFactory: (appleAuthService: AppleAuthService) =>
            new UseCaseProxy(new AppleOAuthUseCases(appleAuthService)),
        },
        {
          inject: [KakaoAuthService],
          provide: UseCasesProxyModule.KAKAO_OAUTH_USECASES_PROXY,
          useFactory: (kakaoAuthService: KakaoAuthService) =>
            new UseCaseProxy(new KakaoOAuthUseCases(kakaoAuthService)),
        },
        {
          inject: [
            DatabaseUserRepository,
            DatabaseNotificationChannelRepository,
          ],
          provide: UseCasesProxyModule.CREATE_USER_USECASES_PROXY,
          useFactory: (
            userRepo: DatabaseUserRepository,
            notificationChannelRepo: DatabaseNotificationChannelRepository,
          ) =>
            new UseCaseProxy(
              new CreateUserUseCases(userRepo, notificationChannelRepo),
            ),
        },
        {
          inject: [DatabaseUserRepository, RedisCacheService],
          provide: UseCasesProxyModule.LOGOUT_USECASES_PROXY,
          useFactory: (
            userRepo: DatabaseUserRepository,
            redisCacheService: RedisCacheService,
          ) =>
            new UseCaseProxy(new LogoutUseCases(userRepo, redisCacheService)),
        },
        {
          inject: [DatabaseUserRepository],
          provide: UseCasesProxyModule.UPDATE_USER_USECASES_PROXY,
          useFactory: (userRepo: DatabaseUserRepository) =>
            new UseCaseProxy(new UpdateUserUseCases(userRepo)),
        },
        {
          inject: [DatabaseUserRepository],
          provide: UseCasesProxyModule.WITHDRAW_USER_USECASES_PROXY,
          useFactory: (userRepo: DatabaseUserRepository) =>
            new UseCaseProxy(new WithdrawUserUseCases(userRepo)),
        },
        {
          inject: [
            DatabaseChannelRepository,
            DatabaseUserRepository,
            DatabaseAlbumRepository,
            DatabaseCoupleInfoRepository,
            DatabaseMessageChannelRepository,
            JwtTokenService,
            EnvironmentConfigService,
            ExceptionsService,
          ],
          provide: UseCasesProxyModule.CREATE_CHANNEL_USECASES_PROXY,
          useFactory: (
            channelRepo: DatabaseChannelRepository,
            userRepo: DatabaseUserRepository,
            albumRepo: DatabaseAlbumRepository,
            coupleInfoRepo: DatabaseCoupleInfoRepository,
            messageChannelRepo: DatabaseMessageChannelRepository,
            jwtTokenService: JwtTokenService,
            config: EnvironmentConfigService,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new CreateChannelUseCases(
                channelRepo,
                userRepo,
                albumRepo,
                coupleInfoRepo,
                messageChannelRepo,
                jwtTokenService,
                config,
                exceptionService,
              ),
            ),
        },
        {
          inject: [DatabaseChannelRepository],
          provide: UseCasesProxyModule.GET_CHANNEL_USECASES_PROXY,
          useFactory: (channelRepo: DatabaseChannelRepository) =>
            new UseCaseProxy(new GetChannelUseCases(channelRepo)),
        },
        {
          inject: [JwtTokenService, EnvironmentConfigService],
          provide: UseCasesProxyModule.GENERATE_COUPLE_CODE_USECASES_PROXY,
          useFactory: (
            JwtTokenService: JwtTokenService,
            config: EnvironmentConfigService,
          ) =>
            new UseCaseProxy(
              new GenerateCoupleCodeUseCases(JwtTokenService, config),
            ),
        },
        {
          inject: [DatabaseMessageChannelRepository, DatabaseMessageRepository],
          provide: UseCasesProxyModule.GET_MESSAGES_USECASES_PROXY,
          useFactory: (
            messageChannelRepo: DatabaseMessageChannelRepository,
            messageRepo: DatabaseMessageRepository,
          ) =>
            new UseCaseProxy(
              new GetMessagesUseCases(messageChannelRepo, messageRepo),
            ),
        },
        {
          inject: [DatabaseMessageRepository, DatabaseMessageChannelRepository],
          provide: UseCasesProxyModule.CREATE_MESSAGE_USECASES_PROXY,
          useFactory: (
            messageRepo: DatabaseMessageRepository,
            channelRepo: DatabaseMessageChannelRepository,
          ) =>
            new UseCaseProxy(
              new CreateMessageUseCases(messageRepo, channelRepo),
            ),
        },
        {
          inject: [DatabaseCoupleInfoRepository],
          provide: UseCasesProxyModule.UPDATE_COUPLE_INFO_USECASES_PROXY,
          useFactory: (coupleInfoRepo: DatabaseCoupleInfoRepository) =>
            new UseCaseProxy(new UpdateCoupleInfoUseCases(coupleInfoRepo)),
        },
        {
          inject: [DatabaseCoupleInfoRepository],
          provide: UseCasesProxyModule.GET_COUPLE_INFO_USECASES_PROXY,
          useFactory: (coupleInfoRepo: DatabaseCoupleInfoRepository) =>
            new UseCaseProxy(new GetCoupleInfoUseCases(coupleInfoRepo)),
        },
        {
          inject: [DatabaseFeedRepository, DatabaseAlbumRepository],
          provide: UseCasesProxyModule.CREATE_FEED_USECASES_PROXY,
          useFactory: (
            feedRepo: DatabaseFeedRepository,
            albumRepo: DatabaseAlbumRepository,
          ) => new UseCaseProxy(new CreateFeedUseCases(feedRepo, albumRepo)),
        },
        {
          inject: [DatabaseFeedRepository, DatabaseAlbumRepository, AwsService],
          provide: UseCasesProxyModule.CREATE_FEED_UPLOAD_USECASES_PROXY,
          useFactory: (
            feedRepo: DatabaseFeedRepository,
            albumRepo: DatabaseAlbumRepository,
            awsService: AwsService,
          ) =>
            new UseCaseProxy(
              new CreateFeedUploadUseCases(feedRepo, albumRepo, awsService),
            ),
        },
        {
          inject: [AwsService],
          provide: UseCasesProxyModule.PRESIGNED_FEED_IMAGE_USECASES_PROXY,
          useFactory: (awsService: AwsService) =>
            new UseCaseProxy(new PresignedFeedImageUseCases(awsService)),
        },
        {
          inject: [DatabaseFeedRepository],
          provide: UseCasesProxyModule.GET_FEED_USECASES_PROXY,
          useFactory: (feedRepo: DatabaseFeedRepository) =>
            new UseCaseProxy(new GetFeedUseCases(feedRepo)),
        },
        {
          inject: [DatabaseFeedRepository],
          provide: UseCasesProxyModule.LIKE_FEED_USECASES_PROXY,
          useFactory: (feedRepo: DatabaseFeedRepository) =>
            new UseCaseProxy(new LikeFeedUseCases(feedRepo)),
        },
        {
          inject: [DatabaseFeedRepository, ExceptionsService],
          provide: UseCasesProxyModule.UPDATE_FEED_USECASES_PROXY,
          useFactory: (
            feedRepo: DatabaseFeedRepository,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new UpdateFeedUseCases(feedRepo, exceptionService),
            ),
        },
        {
          inject: [DatabaseAlbumRepository],
          provide: UseCasesProxyModule.GET_ALBUM_USECASES_PROXY,
          useFactory: (albumRepo: DatabaseAlbumRepository) =>
            new UseCaseProxy(new GetAlbumUseCases(albumRepo)),
        },
        {
          inject: [
            DatabaseFeedRepository,
            DatabaseAlbumRepository,
            ExceptionsService,
          ],
          provide: UseCasesProxyModule.DELETE_FEED_USECASES_PROXY,
          useFactory: (
            feedRepo: DatabaseFeedRepository,
            albumRepo: DatabaseAlbumRepository,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new DeleteFeedUseCases(feedRepo, albumRepo, exceptionService),
            ),
        },
        {
          inject: [DatabaseNotificationChannelRepository],
          provide: UseCasesProxyModule.GET_NOTIFICATION_USECASES_PROXY,
          useFactory: (
            notificationChannelRepo: DatabaseNotificationChannelRepository,
          ) =>
            new UseCaseProxy(
              new GetNotificationUseCases(notificationChannelRepo),
            ),
        },
      ],
      exports: [
        UseCasesProxyModule.LOGIN_USECASES_PROXY,
        UseCasesProxyModule.LOGOUT_USECASES_PROXY,

        UseCasesProxyModule.GOOGLE_OAUTH_USECASES_PROXY,
        UseCasesProxyModule.APPLE_OAUTH_USECASES_PROXY,
        UseCasesProxyModule.KAKAO_OAUTH_USECASES_PROXY,

        UseCasesProxyModule.CREATE_USER_USECASES_PROXY,
        UseCasesProxyModule.UPDATE_USER_USECASES_PROXY,
        UseCasesProxyModule.WITHDRAW_USER_USECASES_PROXY,

        UseCasesProxyModule.CREATE_CHANNEL_USECASES_PROXY,
        UseCasesProxyModule.CREATE_FEED_UPLOAD_USECASES_PROXY,
        UseCasesProxyModule.PRESIGNED_FEED_IMAGE_USECASES_PROXY,
        UseCasesProxyModule.GET_FEED_USECASES_PROXY,

        UseCasesProxyModule.GET_CHANNEL_USECASES_PROXY,

        UseCasesProxyModule.GET_MESSAGES_USECASES_PROXY,

        UseCasesProxyModule.CREATE_MESSAGE_USECASES_PROXY,

        UseCasesProxyModule.UPDATE_COUPLE_INFO_USECASES_PROXY,
        UseCasesProxyModule.GET_COUPLE_INFO_USECASES_PROXY,

        UseCasesProxyModule.GENERATE_COUPLE_CODE_USECASES_PROXY,

        UseCasesProxyModule.CREATE_FEED_USECASES_PROXY,

        UseCasesProxyModule.GET_ALBUM_USECASES_PROXY,
        UseCasesProxyModule.LIKE_FEED_USECASES_PROXY,
        UseCasesProxyModule.UPDATE_FEED_USECASES_PROXY,
        UseCasesProxyModule.DELETE_FEED_USECASES_PROXY,

        UseCasesProxyModule.GET_NOTIFICATION_USECASES_PROXY,
      ],
    };
  }
}
