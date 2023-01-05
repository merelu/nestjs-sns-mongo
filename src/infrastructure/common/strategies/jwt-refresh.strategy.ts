import { TokenPayload } from '@domain/model/common/auth';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { ExceptionsService } from '@infrastructure/services/exceptions/exceptions.service';
import { UseCasesProxyModule } from '@infrastructure/usercases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '@infrastructure/usercases-proxy/usecases-proxy';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LoginUseCases } from '@usecases/auth/login.usecases';
import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: EnvironmentConfigService,
    private readonly exceptionService: ExceptionsService,
    @Inject(UseCasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
        (request: Request) => {
          const token = request.body['refresh_token'];

          if (!token) {
            throw this.exceptionService.badRequestException({
              error_code: CommonErrorCodeEnum.INVALID_PARAM,
              error_description: 'Empty refresh_token',
            });
          }
          return token;
        },
      ]),
      secretOrKey: configService.getJwtRefreshSecret(),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const token = (request?.cookies?.Refresh ||
      request.body.refresh_token) as string;
    const signiture = token.split('.')[2];

    const isValid = await this.loginUsecaseProxy
      .getInstance()
      .compareRefreshTokenHash(payload.sub, signiture);

    if (!isValid) {
      throw this.exceptionService.unauthorizedException({
        error_code: CommonErrorCodeEnum.UNAUTHORIZED,
        error_description: '유효하지 않은 토큰입니다.',
      });
    }
    const user = await this.loginUsecaseProxy
      .getInstance()
      .validateUserForJWTStrategy(new Types.ObjectId(payload.sub));

    if (!user) {
      throw this.exceptionService.unauthorizedException({
        error_code: CommonErrorCodeEnum.UNAUTHORIZED,
        error_description: '유효하지 않은 토큰입니다.',
      });
    }

    return user;
  }
}
