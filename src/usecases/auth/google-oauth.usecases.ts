import { IGoogleAuthService } from '@domain/adapters/google-auth.interface';
import { OAuthPayload } from '@domain/model/common/oauth-payload';
import { TokenInfo } from 'google-auth-library';

export class GoogleOAuthUseCases {
  constructor(private readonly googleAuthService: IGoogleAuthService) {}

  async authToken(token: string): Promise<TokenInfo> {
    return await this.googleAuthService.getTokenInfo(token);
  }

  async getUserInfo(
    token: string,
    provideId: string,
    email: string,
  ): Promise<OAuthPayload> {
    return await this.googleAuthService.fetchUserInfo(token, provideId, email);
  }
}
