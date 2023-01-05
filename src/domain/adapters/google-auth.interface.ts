import { TokenInfo } from 'google-auth-library';
import { OAuthPayload } from '../model/common/oauth-payload';

export interface IGoogleAuthService {
  getTokenInfo(token: string): Promise<TokenInfo>;

  fetchUserInfo(
    token: string,
    providerId: string,
    email: string,
  ): Promise<OAuthPayload>;
}
