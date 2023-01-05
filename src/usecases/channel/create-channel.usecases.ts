import { IJwtService } from '@domain/adapters/jwt.interface';
import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';
import { JwtConfig } from '@domain/config/jwt.interface';
import { IException } from '@domain/exceptions/exceptions.interface';
import { CreateAlbumModel } from '@domain/model/database/album';
import { CreateChannelModel } from '@domain/model/database/channel';
import {
  CoupleInfoModel,
  CreateCoupleInfoModel,
} from '@domain/model/database/couple-info';
import { MessageChannelModel } from '@domain/model/database/message-channel';
import { IAlbumRepository } from '@domain/repositories/album.repository.interface';
import { IChannelRepository } from '@domain/repositories/channel.repository.interface';
import { ICoupleInfoRepository } from '@domain/repositories/couple-info.repository.interface';
import { IMessageChannelRepository } from '@domain/repositories/message-channel.repository.interface';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { ClientSession, Types } from 'mongoose';

export class CreateChannelUseCases {
  constructor(
    private readonly channelRepository: IChannelRepository,
    private readonly userRepository: IUserRepository,
    private readonly albumRepository: IAlbumRepository,
    private readonly coupleInfoRepository: ICoupleInfoRepository,
    private readonly messageChannelRepository: IMessageChannelRepository,
    private readonly jwtTokenService: IJwtService,
    private readonly jwtConfig: JwtConfig,
    private readonly exceptionService: IException,
  ) {}

  async createChannel(
    userId: Types.ObjectId,
    memberId: Types.ObjectId,
    session: ClientSession,
  ) {
    const newChannel = new CreateChannelModel();
    newChannel.member_ids = [userId, memberId];

    const createdChannel = await this.channelRepository.insert(
      newChannel,
      session,
    );

    await this.userRepository.updateUserByUpdateQuery(
      userId,
      {
        $set: { channel_id: createdChannel._id },
      },
      session,
    );
    await this.userRepository.updateUserByUpdateQuery(
      memberId,
      {
        $set: { channel_id: createdChannel._id },
      },
      session,
    );
    await this.createCoupleInfo({ channel_id: createdChannel._id }, session);
    await this.createMessageChannel(
      { channel_id: createdChannel._id },
      session,
    );
    await this.createAlbum({ channel_id: createdChannel._id }, session);

    return createdChannel;
  }

  async createAlbum(data: CreateAlbumModel, session?: ClientSession) {
    return await this.albumRepository.insert(data, session);
  }

  async createCoupleInfo(
    data: CreateCoupleInfoModel,
    session?: ClientSession,
  ): Promise<CoupleInfoModel> {
    return await this.coupleInfoRepository.insert(data, session);
  }

  async createMessageChannel(
    data: CreateCoupleInfoModel,
    session?: ClientSession,
  ): Promise<MessageChannelModel> {
    return await this.messageChannelRepository.insert(data, session);
  }

  async checkCoupleCode(code: string): Promise<Types.ObjectId | null> {
    let id = '';
    try {
      const decode = await this.jwtTokenService.checkToken(
        code,
        this.jwtConfig.getJwtCoupleCodeSecret(),
      );

      id = decode.sub;
    } catch (err) {
      console.log(err);
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_description: '유효하지 않은 코드 입니다.',
      });
    }

    const user = await this.userRepository.getUserById(new Types.ObjectId(id));

    if (!user) {
      return null;
    }

    return user._id;
  }
}
