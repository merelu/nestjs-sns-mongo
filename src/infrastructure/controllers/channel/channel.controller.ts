import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';
import { UserModel } from '@domain/model/database/user';
import { AuthJwt } from '@infrastructure/common/decorators/auth.decorator';
import { ApiResponseType } from '@infrastructure/common/decorators/response.decorator';
import { User } from '@infrastructure/common/decorators/user.decorator';
import { ExceptionsService } from '@infrastructure/services/exceptions/exceptions.service';
import { UseCaseProxy } from '@infrastructure/usercases-proxy/usecases-proxy';
import { UseCasesProxyModule } from '@infrastructure/usercases-proxy/usecases-proxy.module';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateChannelUseCases } from '@usecases/channel/create-channel.usecases';
import { GetChannelUseCases } from '@usecases/channel/get-channel.usecases';
import { Connection } from 'mongoose';
import { CreateChannelDto } from './channel.dto';
import { ChannelPresenter } from './channel.presenter';

@Controller('channel')
@ApiTags('Channel')
@ApiInternalServerErrorResponse({
  description: '확인되지 않은 서버에러, error_code: -6',
})
@ApiExtraModels(ChannelPresenter)
export class ChannelController {
  constructor(
    @Inject(UseCasesProxyModule.CREATE_CHANNEL_USECASES_PROXY)
    private readonly createChannelUseCaseProxy: UseCaseProxy<CreateChannelUseCases>,
    @Inject(UseCasesProxyModule.GET_CHANNEL_USECASES_PROXY)
    private readonly getChannelUseCaseProxy: UseCaseProxy<GetChannelUseCases>,
    private readonly exceptionService: ExceptionsService,
    @InjectConnection() private connection: Connection,
  ) {}

  @Post()
  @AuthJwt()
  @ApiOperation({ summary: '채널 생성' })
  @ApiBadRequestResponse({
    description:
      '이미 등록된 채널이 있는경우(error_code: -1), 자기 자신과 코드를 주고 받았을 경우 (error_code: -1)',
  })
  @ApiForbiddenResponse({
    description: '커플 코드가 유효하지 않을 경우(error_code: -5)',
  })
  @ApiResponseType(ChannelPresenter)
  async createChannel(@User() user: UserModel, @Body() data: CreateChannelDto) {
    if (user.channel_id) {
      throw this.exceptionService.badRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_description: '이미 커플 등록된 유저입니다.',
      });
    }
    const useCase = this.createChannelUseCaseProxy.getInstance();
    const verifiedUserId = await useCase.checkCoupleCode(data.couple_code);

    if (verifiedUserId && user._id.equals(verifiedUserId)) {
      throw this.exceptionService.badRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_description: '자기 자신과 코드를 주고 받을 수 없습니다.',
      });
    }
    if (!verifiedUserId) {
      throw this.exceptionService.badRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_description: '토큰에 해당하는 유저 정보가 없습니다.',
      });
    }

    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      const newChannel = await useCase.createChannel(
        user._id,
        verifiedUserId,
        session,
      );

      await session.commitTransaction();
      return new ChannelPresenter(newChannel);
    } catch (err) {
      console.log(err);
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }
}
