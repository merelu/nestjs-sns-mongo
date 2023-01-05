import { FcmEventTypeEnum } from '@domain/common/enums/fcm-event-type.enum';
import { NotificationModel } from '@domain/model/database/notification';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationPresenter {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  event_type: FcmEventTypeEnum;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  created_at: Date;

  constructor(data: NotificationModel) {
    this.id = data._id.toString();
    this.title = data.title;
    this.body = data.body;
    this.event_type = data.event_type;
    this.read = data.read;
    this.created_at = data.created_at;
  }
}
