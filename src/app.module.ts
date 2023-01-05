import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { ExceptionsModule } from '@infrastructure/services/exceptions/exceptions.module';
import { LoggerModule } from '@infrastructure/services/logger/logger.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { UseCasesProxyModule } from '@infrastructure/usercases-proxy/usecases-proxy.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@infrastructure/common/strategies/jwt.strategy';
import { ControllersModule } from '@infrastructure/controllers/controllers.module';
import { HttpStrategy } from '@infrastructure/common/strategies/http.strategy';
import { JwtRefreshTokenStrategy } from '@infrastructure/common/strategies/jwt-refresh.strategy';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/static',
    }),
    EnvironmentConfigModule,
    ExceptionsModule,
    LoggerModule,
    UseCasesProxyModule.register(),
    PassportModule,
    ControllersModule,
  ],
  providers: [JwtStrategy, HttpStrategy, JwtRefreshTokenStrategy],
})
export class AppModule {}
