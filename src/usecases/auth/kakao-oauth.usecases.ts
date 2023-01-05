import {
  IKakaoAuthService,
  IKakaoTokenData,
} from '@domain/adapters/kakao-auth.interface';
import { OAuthPayload } from '@domain/model/common/oauth-payload';

export class KakaoOAuthUseCases {
  constructor(private readonly kakaoAuthService: IKakaoAuthService) {}

  async authToken(token: string): Promise<IKakaoTokenData> {
    return await this.kakaoAuthService.authToken(token);
  }

  async getUserInfo(token: string): Promise<OAuthPayload> {
    return await this.kakaoAuthService.getUserInfo(token);
  }
}
