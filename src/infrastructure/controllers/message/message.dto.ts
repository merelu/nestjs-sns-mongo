import { MessageType } from '@domain/common/enums/message.enum';
import { IPagination } from '@domain/model/common/pagination';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import dayjs from 'dayjs';

export class CreateMessageDto {
  @ApiProperty({ type: Number, required: true })
  @Type(() => Number)
  @IsEnum(MessageType)
  readonly type: MessageType;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly content: string;
}

export class MessagesQueryDto implements IPagination {
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
