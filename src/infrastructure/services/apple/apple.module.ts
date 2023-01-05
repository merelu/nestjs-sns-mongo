import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { Module } from '@nestjs/common';
import { AppleAuthService } from './apple-auth.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { JwtServiceModule } from '../jwt/jwt.module';
import { JwtTokenService } from '../jwt/jwt.service';

@Module({
  imports: [
    EnvironmentConfigModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    JwtServiceModule,
  ],
  providers: [
    {
      inject: [EnvironmentConfigService, HttpService, JwtTokenService],
      provide: AppleAuthService,
      useFactory: (
        config: EnvironmentConfigService,
        httpService: HttpService,
        jwtTokenService: JwtTokenService,
      ) => new AppleAuthService(config, httpService, jwtTokenService),
    },
  ],
  exports: [AppleAuthService],
})
export class AppleModule {}
