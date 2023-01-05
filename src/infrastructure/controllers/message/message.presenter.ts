import { MessageType } from '@domain/common/enums/message.enum';
import { MessageModel } from '@domain/model/database/message';
import { ApiProperty } from '@nestjs/swagger';

export class MessagePresenter {
  @ApiProperty()
  id: string;

  @ApiProperty()
  sender_id: string;

  @ApiProperty()
  type: MessageType;

  @ApiProperty()
  content: string;

  @ApiProperty()
  read_user_ids: string[];

  @ApiProperty()
  created_at: Date;

  constructor(message: MessageModel) {
    this.id = message._id.toString();
    this.sender_id = message.sender_id.toString();
    this.type = message.type;
    this.content = message.content;
    this.read_user_ids = message.read_user_ids.map((i) => i.toString());

    this.created_at = message.created_at;
  }
}

export class LastMessagePresenter {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: Number })
  type: MessageType;

  @ApiProperty()
  content: string;

  @ApiProperty()
  created_at: Date;

  constructor(message: MessageModel) {
    this.id = message._id.toString();
    this.type = message.type;
    this.content = message.content;
    this.created_at = message.created_at;
  }
}
