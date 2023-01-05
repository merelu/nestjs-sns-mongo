import { AppleAuthConfig } from '@domain/config/apple-auth.interface';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IJwtService } from '@domain/adapters/jwt.interface';
import { IAppleAuthService } from '@domain/adapters/apple-auth.interface';
import { OAuthPayload } from '@domain/model/common/oauth-payload';
import { GenderTypeEnum } from '@domain/common/enums/user/gender-type.enum';
import { AuthTypeEnum } from '@domain/common/enums/user/auth-type.enum';

@Injectable()
export class AppleAuthService implements IAppleAuthService {
  constructor(
    private readonly appleAuthConfig: AppleAuthConfig,
    private readonly httpService: HttpService,
    private readonly jwtTokenService: IJwtService,
  ) {}

  async authenticate(idToken: string): Promise<OAuthPayload> {
    try {
      // const { data } = await this.httpService.axiosRef.post(
      //   'https://appleid.apple.com/auth/token',
      //   {},
      //   {
      //     headers: {
      //       'Content-Type': 'application/x-www-form-urlencoded',
      //     },
      //     params: {
      //       grant_type: 'authorization_code',
      //       code,
      //       client_secret: this.createSignWithAppleSecret(),
      //       client_id: this.appleAuthConfig.getAppleServiceId(),
      //       redirect_uri: 'postMessage',
      //     },
      //   },
      // );

      const decode = (await this.jwtTokenService.checkToken(idToken)) as {
        sub: string;
        email: string;
        name?: string;
      };

      return {
        id: decode.sub,
        auth_type: AuthTypeEnum.apple,
        profile: {
          email: decode.email,
          gender_type: GenderTypeEnum.unspecified,
          birthday: null,
          name: decode.name
            ? decode.name
            : `유저${Math.random().toString(36).substring(2, 10)}`,
          profile_image_url: '',
        },
      };
    } catch (err) {
      throw err;
    }
  }

  private createSignWithAppleSecret() {
    const token = this.jwtTokenService.createTokenByOption({
      secret: this.appleAuthConfig.getAppleSecretKey(),
      algorithm: 'ES256',
      expiresIn: '1h',
      audience: 'https://appleid.apple.com',
      issuer: this.appleAuthConfig.getAppleTeamId(),
      subject: this.appleAuthConfig.getAppleServiceId(),
      keyid: this.appleAuthConfig.getAppleKeyId(),
    });
    return token;
  }
}
