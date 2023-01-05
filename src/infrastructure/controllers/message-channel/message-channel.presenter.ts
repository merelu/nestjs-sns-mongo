import { MessageChannelSimpleModel } from '@domain/model/database/message-channel';
import { ApiProperty } from '@nestjs/swagger';
import { LastMessagePresenter } from '../message/message.presenter';

export class MessageChannelPresenter {
  @ApiProperty()
  id: string;

  @ApiProperty()
  last_message: LastMessagePresenter | null;

  @ApiProperty()
  last_message_updated_at: Date;

  constructor(messageChannel: MessageChannelSimpleModel) {
    this.id = messageChannel._id.toString();
    this.last_message = messageChannel.last_message
      ? new LastMessagePresenter(messageChannel.last_message)
      : null;
    this.last_message_updated_at = messageChannel.last_message_updated_at;
  }
}
