import { IGoogleAuthService } from '@domain/adapters/google-auth.interface';
import { OAuthPayload, OAuthProfile } from '@domain/model/common/oauth-payload';
import {
  GenderTypeEnum,
  genderTypeEnumMap,
} from '@domain/common/enums/user/gender-type.enum';
import { GoogleAuthConfig } from '@domain/config/google-auth.interface';
import { Injectable } from '@nestjs/common';
import { people_v1, people } from '@googleapis/people';
import { OAuth2Client } from 'google-auth-library';
import { AuthTypeEnum } from '@domain/common/enums/user/auth-type.enum';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';

@Injectable()
export class GoogleAuthService implements IGoogleAuthService {
  oauthClient: OAuth2Client;

  constructor(
    private readonly googleAuthConfig: GoogleAuthConfig,
    private readonly exceptionService: ExceptionsService,
  ) {
    const clientId = this.googleAuthConfig.getGoogleAuthClientId();
    const clientSecret = this.googleAuthConfig.getGoogleAuthClientSecret();
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  async getTokenInfo(token: string) {
    const result = await this.oauthClient.getTokenInfo(token);
    return result;
  }

  async fetchUserInfo(
    token: string,
    provideId: string,
    email: string,
  ): Promise<OAuthPayload> {
    try {
      this.oauthClient.setCredentials({
        access_token: token,
      });

      const service = people({ version: 'v1', auth: this.oauthClient });

      const { data } = await service.people.get({
        resourceName: 'people/me',
        personFields: 'genders,birthdays,names,photos',
      });

      return this.toOAuthPayload(provideId, email, data);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  private toOAuthPayload(
    id: string,
    email: string,
    people: people_v1.Schema$Person,
  ): OAuthPayload {
    const result = new OAuthPayload();
    result.id = id;
    result.auth_type = AuthTypeEnum.google;
    result.profile = this.toOAuthProfile(email, people);
    return result;
  }

  private toOAuthProfile(
    email: string,
    people: people_v1.Schema$Person,
  ): OAuthProfile {
    const result = new OAuthProfile();
    result.email = email;
    result.name = people.names
      ? (people.names[0].displayName as string)
      : `유저 ${Math.random().toString(36).substring(2, 10)}`;
    result.birthday = this.parseBirth(people.birthdays);
    result.gender_type = this.parseGender(people.genders);
    result.profile_image_url = this.parseProfileImage(people.photos); //추후 default profile url 입력
    return result;
  }

  private parseBirth(birthdays?: people_v1.Schema$Birthday[]) {
    if (
      !birthdays ||
      !birthdays[0] ||
      !birthdays[0].date ||
      !birthdays[0].date.year ||
      !birthdays[0].date.month ||
      !birthdays[0].date.day
    ) {
      return null;
    }

    return `${birthdays[0].date.year}${birthdays[0].date.month}${birthdays[0].date.day}`;
  }

  private parseGender(genders?: people_v1.Schema$Gender[]) {
    if (!genders || !genders[0].value) {
      return GenderTypeEnum.unspecified;
    }

    return genderTypeEnumMap(genders[0].value);
  }

  private parseProfileImage(photos?: people_v1.Schema$Photo[]) {
    if (!photos || !photos[0] || !photos[0].url) {
      return '';
    }

    return photos[0].url;
  }
}
