import { TokenPayload } from '@domain/model/common/auth';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';

import { UseCasesProxyModule } from '@infrastructure/usercases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '@infrastructure/usercases-proxy/usecases-proxy';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LoginUseCases } from '@usecases/auth/login.usecases';
import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';
import { ExceptionsService } from '@infrastructure/services/exceptions/exceptions.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UseCasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly exceptionService: ExceptionsService,
    private readonly configService: EnvironmentConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies.Authentication;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.getJwtSecret(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: TokenPayload) {
    const user = this.loginUsecaseProxy
      .getInstance()
      .validateUserForJWTStrategy(new Types.ObjectId(payload.sub));
    if (!user) {
      throw this.exceptionService.unauthorizedException({
        error_code: CommonErrorCodeEnum.UNAUTHORIZED,
        error_description: '유효 하지 않은 토큰입니다.',
      });
    }
    return user;
  }
}
