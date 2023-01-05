import {
  IKakaoTokenData,
  IKakaoAccountData,
  IKakaoAuthService,
  IKakaoUserInfoData,
} from '@domain/adapters/kakao-auth.interface';
import { genderTypeEnumMap } from '@domain/common/enums/user/gender-type.enum';
import { AuthTypeEnum } from '@domain/common/enums/user/auth-type.enum';
import { OAuthPayload, OAuthProfile } from '@domain/model/common/oauth-payload';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KakaoAuthService implements IKakaoAuthService {
  constructor(private readonly httpService: HttpService) {}

  async authToken(token: string): Promise<IKakaoTokenData> {
    const { data } = await this.httpService.axiosRef.get<IKakaoTokenData>(
      'https://kapi.kakao.com/v1/user/access_token_info',
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return data;
  }

  async getUserInfo(token: string): Promise<OAuthPayload> {
    const { data } = await this.httpService.axiosRef.get<IKakaoUserInfoData>(
      'https://kapi.kakao.com/v2/user/me',
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          property_keys: [
            'kakao_account.gender',
            'kakao_account.email',
            'kakao_account.name',
            'kakao_account.profile',
            'kakao_account.birthday',
            'kakao_account.birthyear',
          ],
        },
      },
    );

    return this.toOAuthPayload(data);
  }

  private toOAuthPayload(data: IKakaoUserInfoData): OAuthPayload {
    const { id, kakao_account } = data;
    const result = new OAuthPayload();

    result.id = id.toString();
    result.auth_type = AuthTypeEnum.kakao;
    result.profile = this.toOAuthProfile(kakao_account);

    return result;
  }

  private toOAuthProfile(kakaoAccount: IKakaoAccountData): OAuthProfile {
    const result = new OAuthProfile();
    if (kakaoAccount.profile_image_needs_agreement) {
      result.name = kakaoAccount.profile.profile_image_url;
    }
    if (kakaoAccount.name_needs_agreement) {
      result.name = kakaoAccount.name;
    }
    if (kakaoAccount.email_needs_agreement) {
      result.email = kakaoAccount.email;
    }
    if (
      kakaoAccount.birthyear_needs_agreement &&
      kakaoAccount.birthday_needs_agreement
    )
      result.name = `${kakaoAccount.birthyear}${kakaoAccount.birthday}`;

    if (kakaoAccount.gender_needs_agreement) {
      result.gender_type = genderTypeEnumMap(kakaoAccount.gender);
    }
    return result;
  }
}
