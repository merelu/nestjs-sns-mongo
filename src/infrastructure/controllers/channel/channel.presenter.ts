import { ChannelStatusEnum } from '@domain/common/enums/channel/channel-status.enum';
import { ChannelModel } from '@domain/model/database/channel';
import { ApiProperty } from '@nestjs/swagger';
import { UserSimplePresenter } from '../user/user.presenter';

export class ChannelPresenter {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: ChannelStatusEnum;

  @ApiProperty({ type: [UserSimplePresenter] })
  members: UserSimplePresenter[];

  constructor(channel: ChannelModel) {
    this.id = channel._id.toString();
    this.status = channel.status;
    this.members = channel.members.map((i) => new UserSimplePresenter(i));
  }
}
