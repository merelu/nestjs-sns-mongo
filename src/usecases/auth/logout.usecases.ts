import { IRedisCacheService } from '@domain/adapters/redis-cache.interface';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { Types } from 'mongoose';

export class LogoutUseCases {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly redisCashService: IRedisCacheService,
  ) {}

  async execute(userId: Types.ObjectId): Promise<string[]> {
    await this.userRepository.updateUserByUpdateQuery(userId, {
      $set: {
        device_token: null,
      },
    });

    await this.redisCashService.del(userId.toString());

    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0; Domain=peaksum.io; SameSite=None; Secure',
    ];
  }
}
