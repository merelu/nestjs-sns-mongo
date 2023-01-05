import { UserModel } from '@domain/model/database/user';
import { AuthJwt } from '@infrastructure/common/decorators/auth.decorator';
import { ApiResponseType } from '@infrastructure/common/decorators/response.decorator';
import { User } from '@infrastructure/common/decorators/user.decorator';
import { AlbumFeedPaginationDto } from '@infrastructure/controllers/album/album.dto';
import { FeedPresenter } from '@infrastructure/controllers/feed/feed.presenter';
import { UseCaseProxy } from '@infrastructure/usercases-proxy/usecases-proxy';
import { UseCasesProxyModule } from '@infrastructure/usercases-proxy/usecases-proxy.module';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetAlbumUseCases } from '@usecases/album/get.album.usecases';

@Controller('album')
@ApiTags('Album')
@ApiInternalServerErrorResponse({
  description: '확인되지 않은 서버에러, error_code: -6',
})
@ApiForbiddenResponse({
  description:
    '앨범 서비스를 사용할 수 없는 유저가 접근한 경우 (error_code: -5)',
})
@ApiExtraModels(FeedPresenter)
export class albumController {
  constructor(
    @Inject(UseCasesProxyModule.GET_ALBUM_USECASES_PROXY)
    private readonly getAlbumUseCaseProxy: UseCaseProxy<GetAlbumUseCases>,
  ) {}

  @Get('feeds')
  @AuthJwt()
  @ApiOperation({ summary: '내 앨범 피드 가져오기' })
  @ApiResponseType(FeedPresenter, true)
  async getAlbumFeedByPagination(
    @User() user: UserModel,
    @Query() data: AlbumFeedPaginationDto,
  ) {
    const useCase = this.getAlbumUseCaseProxy.getInstance();

    const result = await useCase.getAlbumByFeedPagination(
      user.channel_id,
      data,
    );

    return result.feeds.map((i) => new FeedPresenter(i));
  }
}
