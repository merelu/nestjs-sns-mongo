import { GenderTypeEnum } from '@domain/common/enums/user/gender-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @Matches(/^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/)
  @IsOptional()
  birthday: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsEnum(GenderTypeEnum)
  @IsOptional()
  gender_type: GenderTypeEnum;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  push_agree: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  profile_filename: string;
}
