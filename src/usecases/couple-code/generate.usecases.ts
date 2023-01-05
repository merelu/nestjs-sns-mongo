import {
  IJwtService,
  IJwtServicePayload,
} from '@domain/adapters/jwt.interface';
import { JwtConfig } from '@domain/config/jwt.interface';
import { Types } from 'mongoose';

export class GenerateCoupleCodeUseCases {
  constructor(
    private readonly jwtTokenService: IJwtService,
    private readonly jwtConfig: JwtConfig,
  ) {}

  async execute(userId: Types.ObjectId): Promise<string> {
    const payload: IJwtServicePayload = { sub: userId.toString() };
    const secret = this.jwtConfig.getJwtCoupleCodeSecret();
    const expiresIn = this.jwtConfig.getJwtCoupleCodeExpirationTime() + 's';
    const result = this.jwtTokenService.createToken(payload, secret, expiresIn);

    return result;
  }
}
