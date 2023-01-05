import { UserModel } from '@domain/model/database/user';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserModel = request.user;

    return data ? user?.[data as keyof UserModel] : user;
  },
);

export const WsUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToWs().getClient();
    const user: UserModel = request.handshake.user;

    return data ? user?.[data as keyof UserModel] : user;
  },
);
