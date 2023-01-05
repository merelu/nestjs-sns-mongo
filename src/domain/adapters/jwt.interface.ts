import { JwtSignOptions } from '@nestjs/jwt';

export interface IJwtServicePayload {
  sub: string;
  email?: string;
  name?: string;
}

export interface IJwtService {
  checkToken(token: string, secret?: string): Promise<IJwtServicePayload>;
  createToken(
    payload: IJwtServicePayload,
    secret: string,
    expiresIn: string,
  ): string;

  createTokenByOption(option: JwtSignOptions): string;
}
