import { SchemaNames } from '@domain/common/constants/schema-names';
import { GenderTypeEnum } from '@domain/common/enums/user/gender-type.enum';
import { AuthTypeEnum } from '@domain/common/enums/user/auth-type.enum';
import { UserStatusEnum } from '@domain/common/enums/user/user-status.enum';
import { DeviceInfoModel } from '@domain/model/database/device-info';
import { ImageModel } from '@domain/model/database/image';
import { ImageSchema } from '@infrastructure/entities/image.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Document, SchemaTypes, Types } from 'mongoose';
import { CustomSchemaOptions } from './custom-schema.option';
import { DeviceInfoSchema } from './device-info.entity';

export type UserDocument = User & Document;

@Schema(CustomSchemaOptions)
export class User {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SchemaNames.channel,
    default: null,
  })
  channel_id: Types.ObjectId;

  @Prop({
    type: String,
    default: '',
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    default: null,
  })
  mobile: string;

  @Prop({
    type: String,
    default: null,
  })
  birthday: string | null;

  @Prop({
    type: Number,
    enum: GenderTypeEnum,
    default: GenderTypeEnum.unspecified,
  })
  gender_type: GenderTypeEnum;

  @Prop({
    type: Number,
    enum: AuthTypeEnum,
    required: true,
  })
  auth_type: AuthTypeEnum;

  @Prop({
    type: String,
    required: true,
  })
  oauth_user_id: string;

  @Prop({
    type: Number,
    enum: UserStatusEnum,
    default: UserStatusEnum.active,
  })
  status: UserStatusEnum;

  @Prop({
    type: ImageSchema,
    default: null,
  })
  profile_image: ImageModel | null;

  @Prop({
    type: DeviceInfoSchema,
    required: true,
  })
  device_info: DeviceInfoModel;

  @Prop({
    type: Date,
    default: dayjs().toDate(),
  })
  last_login_at: Date;

  @Prop({
    type: Boolean,
    default: false,
  })
  push_agree: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  withdraw: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  withdrew_at: Date;

  readonly created_at: Date;
  readonly updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
