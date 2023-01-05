import { GenderTypeEnum } from '@domain/common/enums/user/gender-type.enum';
import { AuthTypeEnum } from '@domain/common/enums/user/auth-type.enum';
import { UserDetailModel, UserSimpleModel } from '@domain/model/database/user';
import { ApiProperty } from '@nestjs/swagger';
import dayjs from 'dayjs';

export class UserPresenter {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: 'string' })
  channel_id: string | null;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: 'string' })
  birthday: string | null;

  @ApiProperty()
  gender_type: GenderTypeEnum;

  @ApiProperty({ type: 'string' })
  profile_image: string | null;

  @ApiProperty()
  auth_type: AuthTypeEnum;

  constructor(user: UserDetailModel) {
    this.id = user._id.toString();
    this.channel_id = user.channel_id ? user.channel_id.toString() : null;
    this.name = user.name;
    this.birthday = user.birthday;
    this.gender_type = user.gender_type;
    this.profile_image = user.profile_image ? user.profile_image.url : null;
    this.auth_type = user.auth_type;
  }
}

export class UserSimplePresenter {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  birthday: string;

  @ApiProperty()
  gender_type: GenderTypeEnum;

  @ApiProperty({ type: 'string' })
  profile_image: string | null;

  constructor(user: UserSimpleModel) {
    this.id = user._id.toString();
    this.name = user.name;
    this.birthday = dayjs(user.birthday).format('YYYYMMDD');
    this.gender_type = user.gender_type;
    this.profile_image = user.profile_image ? user.profile_image.url : null;
  }
}
