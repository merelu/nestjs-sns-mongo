import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import dayjs from 'dayjs';

export class AddAnniversaryDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ required: true })
  @Transform(({ value }) => dayjs(value).toDate())
  @IsDate()
  @IsNotEmpty()
  readonly datetime: Date;
}

export class UpdateLovedayDto {
  @ApiProperty({ required: true })
  @Transform(({ value }) => dayjs(value).toDate())
  @IsDate()
  @IsNotEmpty()
  readonly loveday: Date;
}
