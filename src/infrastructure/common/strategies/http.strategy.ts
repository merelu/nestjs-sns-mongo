import { LoggerService } from '@infrastructure/services/logger/logger.service';
import { UseCasesProxyModule } from '@infrastructure/usercases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '@infrastructure/usercases-proxy/usecases-proxy';
import { Inject, Injectable } from '@nestjs/common';
import { LoginUseCases } from '@usecases/auth/login.usecases';
import { Types } from 'mongoose';
import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';
import { ExceptionsService } from '@infrastructure/services/exceptions/exceptions.service';

@Injectable()
export class HttpStrategy {
  constructor(
    @Inject(UseCasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUseCaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {}

  async validate(token: string) {
    try {
      const decode = await this.loginUseCaseProxy
        .getInstance()
        .validateJwtToken(token);

      const user = await this.loginUseCaseProxy
        .getInstance()
        .validateUserForJWTStrategy(new Types.ObjectId(decode.sub));

      if (!user) {
        this.logger.warn('JwtStrategy', `UnAuthorized`);
        throw this.exceptionService.unauthorizedException({
          error_code: CommonErrorCodeEnum.UNAUTHORIZED,
          error_description: '인증되지 않은 토큰입니다.',
        });
      }
      if (!user.channel_id) {
        throw this.exceptionService.forbiddenException({
          error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
          error_description: '채팅 서비스를 이용할 수 없는 유저입니다.',
        });
      }

      return user;
    } catch (err) {
      throw err;
    }
  }
}
