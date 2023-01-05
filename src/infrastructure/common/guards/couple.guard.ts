import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';
import { IException } from '@domain/exceptions/exceptions.interface';
import { UserModel } from '@domain/model/database/user';
import { ExceptionsService } from '@infrastructure/services/exceptions/exceptions.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';

@Injectable()
export class CoupleGuard implements CanActivate {
  constructor(
    @Inject(ExceptionsService) private exceptionService: IException,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: UserModel = request.user;
    if (!user.channel_id) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_description: '해당 서비스를 이용할 수 없는 유저입니다.',
      });
    }

    return true;
  }
}
