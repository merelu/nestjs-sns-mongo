import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';
import { FirebaseFcmService } from './firebase-fcm.service';

@Module({
  imports: [EnvironmentConfigModule, LoggerModule],
  providers: [
    {
      inject: [EnvironmentConfigService],
      provide: FirebaseFcmService,
      useFactory: (config: EnvironmentConfigService, logger: LoggerService) =>
        new FirebaseFcmService(config, logger),
    },
  ],
  exports: [FirebaseFcmService],
})
export class FirebaseModule {}
