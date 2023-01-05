import { AddAnniversaryModel } from '@domain/model/database/couple-info';
import { UserModel } from '@domain/model/database/user';
import { AuthJwt } from '@infrastructure/common/decorators/auth.decorator';
import { ApiResponseType } from '@infrastructure/common/decorators/response.decorator';
import { User } from '@infrastructure/common/decorators/user.decorator';
import { CoupleGuard } from '@infrastructure/common/guards/couple.guard';
import { UseCaseProxy } from '@infrastructure/usercases-proxy/usecases-proxy';
import { UseCasesProxyModule } from '@infrastructure/usercases-proxy/usecases-proxy.module';
import { Body, Controller, Get, Inject, Post, Put } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GenerateCoupleCodeUseCases } from '@usecases/couple-code/generate.usecases';
import { GetCoupleInfoUseCases } from '@usecases/couple-info/get-couple-info.usecases';
import { UpdateCoupleInfoUseCases } from '@usecases/couple-info/update-couple-info.usecases';
import {
  AnniversaryPresenter,
  CoupleInfoPresenter,
} from './couple-info.presenter';
import { AddAnniversaryDto, UpdateLovedayDto } from './couple.dto';

@Controller('couple')
@ApiTags('Couple')
@ApiInternalServerErrorResponse({
  description: '확인되지 않은 서버에러, error_code: -6',
})
@ApiExtraModels(CoupleInfoPresenter, AnniversaryPresenter)
export class CoupleController {
  constructor(
    @Inject(UseCasesProxyModule.GENERATE_COUPLE_CODE_USECASES_PROXY)
    private readonly generateCoupleCodeUseCaseProxy: UseCaseProxy<GenerateCoupleCodeUseCases>,
    @Inject(UseCasesProxyModule.UPDATE_COUPLE_INFO_USECASES_PROXY)
    private readonly updateCoupleInfoUseCases: UseCaseProxy<UpdateCoupleInfoUseCases>,
    @Inject(UseCasesProxyModule.GET_COUPLE_INFO_USECASES_PROXY)
    private readonly getCoupleInfoUseCases: UseCaseProxy<GetCoupleInfoUseCases>,
  ) {}

  @Get('code')
  @AuthJwt()
  @ApiOperation({ summary: '코드 생성' })
  @ApiResponseType()
  async generateCode(@User() user: UserModel) {
    const useCase = this.generateCoupleCodeUseCaseProxy.getInstance();
    const result = await useCase.execute(user._id);

    return result;
  }

  @Get('me')
  @AuthJwt(CoupleGuard)
  @ApiOperation({ summary: '내 커플정보 가져오기' })
  @ApiResponseType(CoupleInfoPresenter)
  async getCoupleInfoById(@User() user: UserModel) {
    const result = await this.getCoupleInfoUseCases
      .getInstance()
      .getCoupleInfoByChannelId(user.channel_id);

    if (!result) {
      return null;
    }

    return new CoupleInfoPresenter(result);
  }

  @Post('anniversary')
  @AuthJwt(CoupleGuard)
  @ApiOperation({ summary: '기념일 추가' })
  @ApiResponseType(CoupleInfoPresenter)
  async addAnniversary(
    @User() user: UserModel,
    @Body() dto: AddAnniversaryDto,
  ) {
    const newAnniversary = new AddAnniversaryModel();
    newAnniversary.name = dto.name;
    newAnniversary.datetime = dto.datetime;
    const result = await this.updateCoupleInfoUseCases
      .getInstance()
      .addAnniversary(user.channel_id, newAnniversary);

    if (!result) {
      return null;
    }

    return new CoupleInfoPresenter(result);
  }

  @Put('loveday')
  @AuthJwt(CoupleGuard)
  @ApiOperation({ summary: '연애 시작일 변경' })
  @ApiResponseType(CoupleInfoPresenter)
  async updateLoveday(@User() user: UserModel, @Body() dto: UpdateLovedayDto) {
    const result = await this.updateCoupleInfoUseCases
      .getInstance()
      .updateLoveDay(user.channel_id, dto.loveday);

    if (!result) {
      return null;
    }

    return new CoupleInfoPresenter(result);
  }
}
