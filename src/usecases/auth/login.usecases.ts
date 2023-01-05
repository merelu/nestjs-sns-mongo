import { IBcryptService } from '@domain/adapters/bcrypt.interface';
import {
  IJwtService,
  IJwtServicePayload,
} from '@domain/adapters/jwt.interface';
import { IRedisCacheService } from '@domain/adapters/redis-cache.interface';
import { DevicePlatformEnum } from '@domain/common/enums/device-platform';
import { AuthTypeEnum } from '@domain/common/enums/user/auth-type.enum';
import { JwtConfig } from '@domain/config/jwt.interface';
import { UserModel } from '@domain/model/database/user';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import dayjs from 'dayjs';
import { ClientSession, Types } from 'mongoose';
export class LoginUseCases {
  constructor(
    private readonly jwtTokenService: IJwtService,
    private readonly jwtConfig: JwtConfig,
    private readonly userRepository: IUserRepository,
    private readonly redisCashService: IRedisCacheService,
    private readonly bcryptService: IBcryptService,
  ) {}

  getJwtTokenAndCookie(userId: Types.ObjectId) {
    const payload: IJwtServicePayload = { sub: userId.toString() };
    const secret = this.jwtConfig.getJwtSecret();
    const expiresIn = this.jwtConfig.getJwtExpirationTime() + 's';
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);

    return {
      token,
      cookie: `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.jwtConfig.getJwtExpirationTime()}; SameSite=None; Secure`,
    };
  }

  async getJwtRefreshTokenAndCookie(userId: Types.ObjectId) {
    const payload: IJwtServicePayload = {
      sub: userId.toString(),
    };

    const secret = this.jwtConfig.getJwtRefreshSecret();
    const expiresIn = this.jwtConfig.getJwtRefreshExpirationTime() + 's';
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    const tokenSigniture = token.split('.')[2];
    await this.setCurrentRefreshTokenHash(tokenSigniture, userId);

    return {
      token,
      cookie: `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.jwtConfig.getJwtRefreshExpirationTime()}; SameSite=None; Secure`,
    };
  }

  async validateUserForOAuth(
    provider: AuthTypeEnum,
    id: string,
  ): Promise<UserModel | null> {
    return await this.userRepository.getUserByOAuthPayload(provider, id);
  }

  async validateUserForJWTStrategy(
    userId: Types.ObjectId,
  ): Promise<UserModel | null> {
    return await this.userRepository.getUserById(userId);
  }

  async validateJwtToken(
    token: string,
    secret?: string,
  ): Promise<IJwtServicePayload> {
    const decode = await this.jwtTokenService.checkToken(token, secret);
    return decode;
  }

  async updateLoginTime(userId: Types.ObjectId) {
    await this.userRepository.updateUserByUpdateQuery(userId, {
      $set: { last_login_at: dayjs().toDate() },
    });
  }

  async compareRefreshTokenHash(
    userId: string,
    signiture: string,
  ): Promise<boolean> {
    const matchedHash = await this.redisCashService.get(userId);

    if (!matchedHash) return false;

    const isValid = await this.bcryptService.compare(signiture, matchedHash);

    if (!isValid) {
      return false;
    }
    return true;
  }

  async updateDeviceInfo(
    userId: Types.ObjectId,
    deviceToken: string,
    platform?: DevicePlatformEnum,
    session?: ClientSession,
  ) {
    await this.userRepository.updateUserByUpdateQuery(
      userId,
      {
        $set: {
          'device_info.device_token': deviceToken,
          'device_info.device_token_timestamp': Date.now(),
          'device_info.platform': platform,
        },
      },
      session,
    );
  }

  private async setCurrentRefreshTokenHash(
    signiture: string,
    userId: Types.ObjectId,
  ): Promise<void> {
    const hashedKey = await this.bcryptService.hash(signiture);
    await this.redisCashService.set(
      userId.toString(),
      hashedKey,
      Number(this.jwtConfig.getJwtRefreshExpirationTime()),
    );
  }
}
