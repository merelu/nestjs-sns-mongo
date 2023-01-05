export interface JwtConfig {
  getJwtSecret(): string;
  getJwtExpirationTime(): string;

  getJwtRefreshSecret(): string;
  getJwtRefreshExpirationTime(): string;

  getJwtCoupleCodeSecret(): string;
  getJwtCoupleCodeExpirationTime(): string;
}
