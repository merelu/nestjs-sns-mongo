import { AppleAuthConfig } from '@domain/config/apple-auth.interface';
import { AwsConfig } from '@domain/config/aws.interface';
import { DatabaseConfig } from '@domain/config/database.interface';
import { FirebaseConfig } from '@domain/config/firebase.interface';
import { GoogleAuthConfig } from '@domain/config/google-auth.interface';
import { JwtConfig } from '@domain/config/jwt.interface';
import { RedisConfig } from '@domain/config/redis.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentConfigService
  implements
    DatabaseConfig,
    JwtConfig,
    FirebaseConfig,
    RedisConfig,
    GoogleAuthConfig,
    AppleAuthConfig,
    AwsConfig
{
  constructor(private configService: ConfigService) {}
  getAwsPublicBucketName(): string {
    return this.configService.get<string>('AWS_S3_PUBLIC_BUCKET_NAME') || '';
  }
  getAwsPrivateBucketName(): string {
    return this.configService.get<string>('AWS_S3_PRIVATE_BUCKET_NAME') || '';
  }
  getAwsS3AccessKey(): string {
    return this.configService.get<string>('AWS_S3_ACCESS_KEY') || '';
  }
  getAwsS3SecretKey(): string {
    return this.configService.get<string>('AWS_S3_SECRET_KEY') || '';
  }
  getAwsS3Region(): string {
    return this.configService.get<string>('AWS_S3_REGION') || '';
  }
  getJwtCoupleCodeSecret(): string {
    return this.configService.get<string>('JWT_COUPLE_CODE_SECRET') || '';
  }
  getJwtCoupleCodeExpirationTime(): string {
    return (
      this.configService.get<string>('JWT_COUPLE_CODE_EXPIRATION_TIME') || ''
    );
  }
  getAppleSecretKey(): string {
    return this.configService.get<string>('APPLE_SECRET_KEY') || '';
  }
  getAppleTeamId(): string {
    return this.configService.get<string>('APPLE_TEAM_ID') || '';
  }
  getAppleServiceId(): string {
    return this.configService.get<string>('APPLE_SERVICE_ID') || '';
  }
  getAppleKeyId(): string {
    return this.configService.get<string>('APPLE_KEY_ID') || '';
  }

  getGoogleAuthClientId(): string {
    return this.configService.get<string>('GOOGLE_AUTH_CLIENT_ID') || '';
  }
  getGoogleAuthClientSecret(): string {
    return this.configService.get<string>('GOOGLE_AUTH_CLIENT_SECRET') || '';
  }

  getRedisHost(): string {
    return this.configService.get<string>('REDIS_HOST') || '';
  }
  getRedisPort(): number {
    return this.configService.get<number>('REDIS_PORT') || 6379;
  }

  getFirebaseProjectId(): string {
    return this.configService.get<string>('FIREBASE_PROJECT_ID') || '';
  }

  getFirebasePrivateKey(): string {
    return (
      this.configService.get<string>('FIREBASE_PRIVATE_KEY') || ''
    ).replace(/\\n/g, '\n');
  }

  getFirebaseClientEmail(): string {
    return this.configService.get<string>('FIREBASE_CLIENT_EMAIL') || '';
  }

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || '';
  }

  getJwtExpirationTime(): string {
    return this.configService.get<string>('JWT_EXPIRATION_TIME') || '';
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET') || '';
  }

  getJwtRefreshExpirationTime(): string {
    return (
      this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME') || ''
    );
  }

  getDatabasePort(): number {
    throw new Error('Method not implemented.');
  }

  getDatabaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST') || '';
  }

  getDatabaseUser(): string {
    return this.configService.get<string>('DATABASE_USER') || '';
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD') || '';
  }

  getDatabaseName(): string {
    return this.configService.get<string>('DATABASE_NAME') || '';
  }
}
