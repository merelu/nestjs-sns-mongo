import { applyDecorators, CanActivate, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';

// eslint-disable-next-line @typescript-eslint/ban-types
export function AuthJwt(...guards: (Function | CanActivate)[]) {
  return applyDecorators(
    UseGuards(JwtAuthGuard, ...guards),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: '인증 토큰이 전달되지 않았거나 유효하지 않은 경우',
    }),
  );
}

export function AuthRefreshJwt() {
  return applyDecorators(
    UseGuards(JwtRefreshGuard),
    ApiUnauthorizedResponse({
      description: '리프레시 토큰이 전달되지 않았거나 유효하지 않은 경우',
    }),
  );
}
