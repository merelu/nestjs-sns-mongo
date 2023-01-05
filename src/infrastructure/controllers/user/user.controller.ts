import { UserModel } from '@domain/model/database/user';
import { AuthJwt } from '@infrastructure/common/decorators/auth.decorator';
import { User } from '@infrastructure/common/decorators/user.decorator';
import { ApiResponseType } from '@infrastructure/common/decorators/response.decorator';
import { Body, Controller, Delete, Get, Inject, Put } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserPresenter } from './user.presenter';
import { BaseResponseFormat } from '@domain/response/base.response';
import { UpdateUserDto } from '@infrastructure/controllers/user/user.dto';
import { UseCasesProxyModule } from '@infrastructure/usercases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '@infrastructure/usercases-proxy/usecases-proxy';
import { UpdateUserUseCases } from '@usecases/user/update-user.usecases';
import { WithdrawUserUseCases } from '@usecases/user/withdraw-user.usecases';
import { CoupleGuard } from '@infrastructure/common/guards/couple.guard';

@Controller('user')
@ApiTags('User')
@ApiInternalServerErrorResponse({
  description: '확인되지 않은 서버에러, error_code: -6',
})
@ApiExtraModels(UserPresenter)
export class UserController {
  constructor(
    @Inject(UseCasesProxyModule.UPDATE_USER_USECASES_PROXY)
    private readonly updateUserUseCaseProxy: UseCaseProxy<UpdateUserUseCases>,
    @Inject(UseCasesProxyModule.WITHDRAW_USER_USECASES_PROXY)
    private readonly withdrawUserUseCaseProxy: UseCaseProxy<WithdrawUserUseCases>,
  ) {}
  @Get('me')
  @AuthJwt()
  @ApiOperation({ summary: '내정보' })
  @ApiResponseType(UserPresenter)
  async getUser(@User() user: UserModel): Promise<BaseResponseFormat> {
    return new UserPresenter(user);
  }

  @Put()
  @AuthJwt()
  @ApiOperation({ summary: '유저 정보 수정(변경 필드만)' })
  @ApiResponseType()
  async updateUserByQuery(
    @User() user: UserModel,
    @Body() data: UpdateUserDto,
  ): Promise<string> {
    await this.updateUserUseCaseProxy.getInstance().execute(user._id, data);

    return 'Success';
  }

  @Delete()
  @AuthJwt()
  @ApiOperation({ summary: '유저 탈퇴' })
  @ApiResponseType()
  async withdrawUser(@User() user: UserModel) {
    await this.withdrawUserUseCaseProxy.getInstance().execute(user._id);

    return 'Success';
  }

  @Put('disconnect-couple')
  @AuthJwt(CoupleGuard)
  @ApiOperation({ summary: '커플 연결 끊기' })
  @ApiResponseType()
  async disconnectCouple(@User() user: UserModel) {
    await this.updateUserUseCaseProxy.getInstance().disconnectCouple(user._id);
  }
}
