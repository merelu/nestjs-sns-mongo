import { DevicePlatformEnum } from '@domain/common/enums/device-platform';
import { AuthTypeEnum } from '@domain/common/enums/user/auth-type.enum';
import { PickType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
export class DeviceInfoDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly device_token: string;

  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsEnum(DevicePlatformEnum)
  @IsNotEmpty()
  readonly platform: DevicePlatformEnum;
}
export class OAuthLoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly credential: string;

  @ApiProperty()
  @IsNumber()
  @IsEnum(AuthTypeEnum)
  @IsNotEmpty()
  readonly auth_type: AuthTypeEnum;

  @ApiProperty({ required: true })
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  readonly device_info: DeviceInfoDto;
}

export class AppleOAuthLoginDto extends PickType(OAuthLoginDto, [
  'device_info',
] as const) {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly id_token: string;
}

export class RefreshTokenDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly refresh_token: string;

  @ApiProperty({ required: true })
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  @IsNotEmpty()
  readonly device_info: DeviceInfoDto;
}

export class SignupDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly device_token: string;
}
