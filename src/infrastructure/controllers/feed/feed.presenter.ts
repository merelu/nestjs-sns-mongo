import { AccessTypeEnum } from '@domain/common/enums/feed/access-type.enum';
import { FeedSimpleModel } from '@domain/model/database/feed';
import { ApiProperty } from '@nestjs/swagger';
import { UserSimplePresenter } from '../user/user.presenter';

export class FeedPresenter {
  @ApiProperty()
  id: string;

  @ApiProperty()
  writer: UserSimplePresenter;

  @ApiProperty()
  access_type: AccessTypeEnum;

  @ApiProperty()
  photos: string[];

  @ApiProperty()
  content: string;

  @ApiProperty()
  dating_date: Date;

  @ApiProperty()
  liker_ids: string[];

  constructor(data: FeedSimpleModel) {
    this.id = data._id.toString();
    this.writer = new UserSimplePresenter(data.writer);
    this.access_type = data.access_type;
    this.photos = data.photos.map((i) => i.url);
    this.content = data.content;
    this.dating_date = data.dating_date;
    this.liker_ids = data.liker_ids.map((i) => i.toString());
  }
}
