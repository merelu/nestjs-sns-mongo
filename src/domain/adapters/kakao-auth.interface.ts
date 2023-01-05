import { OAuthPayload } from '../model/common/oauth-payload';

export interface IKakaoTokenData {
  id: number;
  expires_in: number;
  app_id: number;
}
export interface IKakaoUserInfoData {
  id: number;
  kakao_account: IKakaoAccountData;
}

export interface IKakaoAccountData {
  profile_image_needs_agreement: boolean;
  profile: { profile_image_url: string };
  name_needs_agreement: boolean;
  name: string;
  email_needs_agreement: boolean;
  email: string;
  birthyear_needs_agreement: boolean;
  birthyear: string;
  birthday_needs_agreement: boolean;
  birthday: string;
  gender_needs_agreement: boolean;
  gender: string;
}

export interface IKakaoAuthService {
  authToken(token: string): Promise<IKakaoTokenData>;

  getUserInfo(token: string): Promise<OAuthPayload>;
}
