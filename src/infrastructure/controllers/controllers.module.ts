import { ExceptionsModule } from '@infrastructure/services/exceptions/exceptions.module';
import { GatewayModule } from '@infrastructure/gateways/gateway.module';
import { UseCasesProxyModule } from '@infrastructure/usercases-proxy/usecases-proxy.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { ChannelController } from './channel/channel.controller';
import { MessageController } from './message/message.controller';
import { FeedController } from './feed/feed.controller';
import { albumController } from '@infrastructure/controllers/album/album.controller';
import { NotificationController } from './notification/notification.controller';
import { CoupleController } from './couple/couple.controller';

@Module({
  imports: [UseCasesProxyModule.register(), ExceptionsModule, GatewayModule],
  controllers: [
    AuthController,
    UserController,
    ChannelController,
    MessageController,
    FeedController,
    CoupleController,
    albumController,
    NotificationController,
  ],
})
export class ControllersModule {}
