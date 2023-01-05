export interface IRedisCacheService {
  get(key: string): any;

  set(key: string, value: any, ttl?: number): any;

  del(key: string): any;
}
