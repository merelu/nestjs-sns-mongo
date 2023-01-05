import { IAppleAuthService } from '@domain/adapters/apple-auth.interface';
import { OAuthPayload } from '@domain/model/common/oauth-payload';

export class AppleOAuthUseCases {
  constructor(private readonly appleAuthService: IAppleAuthService) {}

  async authApple(idToken: string): Promise<OAuthPayload> {
    return await this.appleAuthService.authenticate(idToken);
  }
}
