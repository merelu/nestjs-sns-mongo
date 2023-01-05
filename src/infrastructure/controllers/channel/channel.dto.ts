import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChannelDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  couple_code: string;
}
