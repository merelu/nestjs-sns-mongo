import { UserModel } from '@domain/model/database/user';
import { AuthJwt } from '@infrastructure/common/decorators/auth.decorator';
import { ApiResponseType } from '@infrastructure/common/decorators/response.decorator';
import { User } from '@infrastructure/common/decorators/user.decorator';
import { UseCaseProxy } from '@infrastructure/usercases-proxy/usecases-proxy';
import { UseCasesProxyModule } from '@infrastructure/usercases-proxy/usecases-proxy.module';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetNotificationUseCases } from '@usecases/notification/get-notification.usecases';
import { NotificationQueryDto } from './notification.dto';
import { NotificationPresenter } from './notification.presenter';

@Controller('notification')
@ApiTags('Notification')
@ApiInternalServerErrorResponse({
  description: '확인되지 않은 서버에러, error_code: -6',
})
@ApiExtraModels(NotificationPresenter)
export class NotificationController {
  constructor(
    @Inject(UseCasesProxyModule.GET_NOTIFICATION_USECASES_PROXY)
    private readonly getNotificationUseCaseProxy: UseCaseProxy<GetNotificationUseCases>,
  ) {}

  @Get('me')
  @AuthJwt()
  @ApiOperation({ summary: '내 알림 목록' })
  @ApiResponseType(NotificationPresenter, true)
  async getNotificationsMine(
    @User() user: UserModel,
    @Query() data: NotificationQueryDto,
  ) {
    const result = await this.getNotificationUseCaseProxy
      .getInstance()
      .getNotificationsByPagination(user._id, data);

    return result.map((i) => new NotificationPresenter(i));
  }
}
