import {
  ClientUsedErrorCodeEnum,
  ClientUsedErrorTextMap,
} from '@domain/common/enums/error-code.enum';
import { IException } from '@domain/exceptions/exceptions.interface';
import { ExceptionsService } from '@infrastructure/services/exceptions/exceptions.service';
import { Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  constructor(@Inject(ExceptionsService) private exceptionService: IException) {
    super();
  }

  handleRequest<UserModel>(err: any, user: UserModel) {
    if (err || !user) {
      throw (
        err ||
        this.exceptionService.unauthorizedException({
          error_code: ClientUsedErrorCodeEnum.REFRESH_TOKEN_EXPIRED,
          error_text:
            ClientUsedErrorTextMap[
              ClientUsedErrorCodeEnum.REFRESH_TOKEN_EXPIRED
            ],
        })
      );
    }
    return user;
  }
}
