import {
  AnniversaryModel,
  CoupleInfoSimpleModel,
} from '@domain/model/database/couple-info';
import { ApiProperty } from '@nestjs/swagger';

export class AnniversaryPresenter {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  datetime: Date;

  @ApiProperty()
  created_at: Date;

  constructor(data: AnniversaryModel) {
    this.id = data._id.toString();
    this.name = data.name;
    this.datetime = data.datetime;
    this.created_at = data.created_at;
  }
}

export class CoupleInfoPresenter {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: [AnniversaryPresenter] })
  anniversaries: AnniversaryPresenter[];

  @ApiProperty()
  love_day: Date;

  constructor(data: CoupleInfoSimpleModel) {
    this.id = data._id.toString();
    this.anniversaries = data.anniversaries.map(
      (i) => new AnniversaryPresenter(i),
    );
    this.love_day = data.love_day;
  }
}
