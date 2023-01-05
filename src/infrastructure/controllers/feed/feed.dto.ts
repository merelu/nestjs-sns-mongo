import { AccessTypeEnum } from '@domain/common/enums/feed/access-type.enum';
import { IPagination } from '@domain/model/common/pagination';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import dayjs from 'dayjs';

export class CreateFeedDto {
  @ApiProperty()
  @Type(() => Number)
  @IsEnum(AccessTypeEnum)
  @IsNotEmpty()
  readonly access_type: AccessTypeEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty()
  @Transform(({ value }) => dayjs(value).toDate())
  @IsDate()
  @IsNotEmpty()
  readonly dating_date: Date;
}

export class CreateFeedByPresignedDto extends CreateFeedDto {
  @ApiProperty({ required: true })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  readonly filenames: string[];
}

export class PresignedDto {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  readonly filenames: string[];
}

export class CreateFeedAndImageDto extends CreateFeedDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  readonly images: any;
}

export class FeedPaginationDto implements IPagination {
  @ApiProperty({ description: 'default: 0', required: false })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  page: number;

  @ApiProperty({ description: 'default: 20', required: false })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  size: number;

  @ApiProperty({ description: 'default: current', required: false })
  @Transform(({ value }) => dayjs(value).toDate())
  @IsDate()
  @IsOptional()
  requested_at: Date;
}

export class UpdateFeedDto {
  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsEnum(AccessTypeEnum)
  @IsOptional()
  readonly access_type: AccessTypeEnum;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly content: string;

  @ApiProperty({ required: false })
  @Transform(({ value }) => dayjs(value).toDate())
  @IsDate()
  @IsOptional()
  readonly dating_date: Date;

  @ApiProperty({ required: true })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly filenames: string[];
}
