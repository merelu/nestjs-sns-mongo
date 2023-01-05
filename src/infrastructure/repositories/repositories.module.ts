import { SchemaNames } from '@domain/common/constants/schema-names';
import { MongooseConfigModule } from '@infrastructure/config/mongoose-config/mongoose-config.module';
import { AlbumSchema } from '@infrastructure/entities/album.entity';
import { ChannelSchema } from '@infrastructure/entities/channel.entity';
import { CoupleInfoSchema } from '@infrastructure/entities/couple-info.entity';
import { FeedSchema } from '@infrastructure/entities/feed.entity';
import { MessageChannelSchema } from '@infrastructure/entities/message-channel.entity';
import { MessageSchema } from '@infrastructure/entities/message.entity';
import { NotificationChannelSchema } from '@infrastructure/entities/notification-channel.entity';
import { UserSchema } from '@infrastructure/entities/user.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseAlbumRepository } from './album.repository';
import { DatabaseChannelRepository } from './channel.repository';
import { DatabaseCoupleInfoRepository } from './couple-info.repository';
import { DatabaseFeedRepository } from './feed.repository';
import { DatabaseMessageChannelRepository } from './message-channel.repository';
import { DatabaseMessageRepository } from './message.repository';
import { DatabaseNotificationChannelRepository } from './notifiaction-channel.repository';
import { DatabaseUserRepository } from './user.repository';

@Module({
  imports: [
    MongooseConfigModule,
    MongooseModule.forFeature([
      { name: SchemaNames.user, schema: UserSchema },
      { name: SchemaNames.channel, schema: ChannelSchema },
      { name: SchemaNames.messageChannel, schema: MessageChannelSchema },
      { name: SchemaNames.message, schema: MessageSchema },
      { name: SchemaNames.coupleInfo, schema: CoupleInfoSchema },
      { name: SchemaNames.feed, schema: FeedSchema },
      { name: SchemaNames.album, schema: AlbumSchema },
      {
        name: SchemaNames.notificationChannel,
        schema: NotificationChannelSchema,
      },
    ]),
  ],
  providers: [
    DatabaseUserRepository,
    DatabaseChannelRepository,
    DatabaseMessageChannelRepository,
    DatabaseMessageRepository,
    DatabaseCoupleInfoRepository,
    DatabaseFeedRepository,
    DatabaseAlbumRepository,
    DatabaseNotificationChannelRepository,
  ],
  exports: [
    DatabaseUserRepository,
    DatabaseChannelRepository,
    DatabaseMessageChannelRepository,
    DatabaseMessageRepository,
    DatabaseCoupleInfoRepository,
    DatabaseFeedRepository,
    DatabaseAlbumRepository,
    DatabaseNotificationChannelRepository,
  ],
})
export class RepositoriesModule {}
