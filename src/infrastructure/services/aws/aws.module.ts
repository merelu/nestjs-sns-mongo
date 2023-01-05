import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { Module } from '@nestjs/common';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { AwsService } from './aws.service';

@Module({
  imports: [EnvironmentConfigModule, ExceptionsModule],
  providers: [
    {
      inject: [EnvironmentConfigService, ExceptionsService],
      provide: AwsService,
      useFactory: (
        config: EnvironmentConfigService,
        exceptionService: ExceptionsService,
      ) => new AwsService(config, exceptionService),
    },
  ],
  exports: [AwsService],
})
export class AwsModule {}
