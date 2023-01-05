import { IPagination } from '@domain/model/common/pagination';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import dayjs from 'dayjs';
export class NotificationQueryDto implements IPagination {
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
