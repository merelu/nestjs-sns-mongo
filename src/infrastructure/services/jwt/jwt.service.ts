import {
  IJwtService,
  IJwtServicePayload,
} from '@domain/adapters/jwt.interface';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService implements IJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async checkToken(
    token: string,
    secret?: string,
  ): Promise<IJwtServicePayload> {
    const decode = await this.jwtService.verifyAsync(token, { secret });
    return decode;
  }

  createToken(payload: any, secret: string, expiresIn: string): string {
    return this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
  }

  createTokenByOption(option: JwtSignOptions): string {
    return this.jwtService.sign({}, option);
  }
}
