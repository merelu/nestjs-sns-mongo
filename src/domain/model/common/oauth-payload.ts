import { GenderTypeEnum } from '@domain/common/enums/user/gender-type.enum';
import { AuthTypeEnum } from '@domain/common/enums/user/auth-type.enum';

export class OAuthPayload {
  id: string;
  auth_type: AuthTypeEnum;
  profile: OAuthProfile;
}

export class OAuthProfile {
  email: string;
  gender_type: GenderTypeEnum;
  birthday: string | null;
  name: string;
  profile_image_url: string;
}
