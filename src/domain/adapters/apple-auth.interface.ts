import { OAuthPayload } from '../model/common/oauth-payload';

export interface IAppleAuthService {
  authenticate(idToken: string): Promise<OAuthPayload>;
}
