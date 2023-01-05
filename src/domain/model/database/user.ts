import { GenderTypeEnum } from '@domain/common/enums/user/gender-type.enum';
import { AuthTypeEnum } from '@domain/common/enums/user/auth-type.enum';
import { UserStatusEnum } from '@domain/common/enums/user/user-status.enum';
import { Types } from 'mongoose';
import { PickType } from '@nestjs/mapped-types';
import { ImageModel } from '@domain/model/database/image';
import { DeviceInfoModel } from './device-info';

export class UserModel {
  _id: Types.ObjectId;
  channel_id: Types.ObjectId;
  name: string;
  email: string;
  mobile: string;

  birthday: string | null;
  gender_type: GenderTypeEnum;
  auth_type: AuthTypeEnum;
  oauth_user_id: string;
  status: UserStatusEnum;

  profile_image: ImageModel | null;
  device_info: DeviceInfoModel;
  last_login_at: Date;

  push_agree: boolean;
  withdraw: boolean;
  withdrew_at: Date;

  created_at: Date;
  updated_at: Date;
}

export class CreateUserModel extends PickType(UserModel, [
  'email',
  'auth_type',
  'oauth_user_id',
  'device_info',
  'gender_type',
  'birthday',
  'name',
  'profile_image',
] as const) {}

export class UserSimpleModel extends PickType(UserModel, [
  '_id',
  'name',
  'birthday',
  'gender_type',
  'status',
  'profile_image',
  'last_login_at',
] as const) {}

export class UserDetailModel extends PickType(UserModel, [
  '_id',
  'channel_id',
  'name',
  'email',
  'birthday',
  'gender_type',
  'auth_type',
  'status',
  'profile_image',
  'last_login_at',
  'created_at',
] as const) {}
