import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { Module } from '@nestjs/common';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { GoogleAuthService } from './google-auth.service';

@Module({
  imports: [EnvironmentConfigModule, ExceptionsModule],
  providers: [
    {
      inject: [EnvironmentConfigService, ExceptionsService],
      provide: GoogleAuthService,
      useFactory: (
        config: EnvironmentConfigService,
        exceptionService: ExceptionsService,
      ) => new GoogleAuthService(config, exceptionService),
    },
  ],
  exports: [GoogleAuthService],
})
export class GoogleModule {}
