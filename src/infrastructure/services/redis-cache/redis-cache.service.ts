import { IRedisCacheService } from '@domain/adapters/redis-cache.interface';
import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { REDIS_CACHE } from './redis.module';

@Injectable()
export class RedisCacheService implements IRedisCacheService {
  constructor(@Inject(REDIS_CACHE) private readonly cache: Cache) {}

  async get(key: string): Promise<any> {
    return await this.cache.get(key);
  }

  async set(key: string, value: any, ttl?: number) {
    await this.cache.set(key, value, { ttl } as any);
  }

  async del(key: string) {
    await this.cache.del(key);
  }
}
