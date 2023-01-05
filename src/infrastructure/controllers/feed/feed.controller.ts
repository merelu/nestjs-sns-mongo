import { UserModel } from '@domain/model/database/user';
import { AuthJwt } from '@infrastructure/common/decorators/auth.decorator';
import { ApiResponseType } from '@infrastructure/common/decorators/response.decorator';
import { User } from '@infrastructure/common/decorators/user.decorator';
import { CoupleGuard } from '@infrastructure/common/guards/couple.guard';
import { ExceptionsService } from '@infrastructure/services/exceptions/exceptions.service';
import { UseCaseProxy } from '@infrastructure/usercases-proxy/usecases-proxy';
import { UseCasesProxyModule } from '@infrastructure/usercases-proxy/usecases-proxy.module';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateFeedUploadUseCases } from '@usecases/feed/create-feed-upload.usecases';
import { CreateFeedUseCases } from '@usecases/feed/create-feed.usecases';
import { DeleteFeedUseCases } from '@usecases/feed/delete.feed.usecases';
import { GetFeedUseCases } from '@usecases/feed/get-feed.usecases';
import { LikeFeedUseCases } from '@usecases/feed/like-feed.usecases';
import { PresignedFeedImageUseCases } from '@usecases/feed/presigned-feed-image.usecases';
import { UpdateFeedUseCases } from '@usecases/feed/update.feed.usecases';
import { Connection, Types } from 'mongoose';
import {
  CreateFeedAndImageDto,
  CreateFeedByPresignedDto,
  PresignedDto,
  FeedPaginationDto,
  UpdateFeedDto,
} from './feed.dto';
import { FeedPresenter } from './feed.presenter';

@Controller('feed')
@ApiTags('Feed')
@ApiInternalServerErrorResponse({
  description: '확인되지 않은 서버에러, error_code: -6',
})
@ApiForbiddenResponse({
  description:
    '피드서비스를 사용할 수 없는 유저가 접근한 경우 (error_code: -5)',
})
@ApiExtraModels(FeedPresenter)
export class FeedController {
  constructor(
    @Inject(UseCasesProxyModule.CREATE_FEED_USECASES_PROXY)
    private readonly createFeedUseCaseProxy: UseCaseProxy<CreateFeedUseCases>,
    @Inject(UseCasesProxyModule.PRESIGNED_FEED_IMAGE_USECASES_PROXY)
    private readonly presignedFeedImageuseCaseProxy: UseCaseProxy<PresignedFeedImageUseCases>,
    @Inject(UseCasesProxyModule.CREATE_FEED_UPLOAD_USECASES_PROXY)
    private readonly createFeedUploadUseCaseProxy: UseCaseProxy<CreateFeedUploadUseCases>,
    @Inject(UseCasesProxyModule.GET_FEED_USECASES_PROXY)
    private readonly getFeedUseCaseProxy: UseCaseProxy<GetFeedUseCases>,
    @Inject(UseCasesProxyModule.LIKE_FEED_USECASES_PROXY)
    private readonly likeFeedUseCaseProxy: UseCaseProxy<LikeFeedUseCases>,
    @Inject(UseCasesProxyModule.UPDATE_FEED_USECASES_PROXY)
    private readonly updateFeedUseCaseProxy: UseCaseProxy<UpdateFeedUseCases>,
    @Inject(UseCasesProxyModule.DELETE_FEED_USECASES_PROXY)
    private readonly deleteFeedUseCaseProxy: UseCaseProxy<DeleteFeedUseCases>,
    private readonly exceptionService: ExceptionsService,
    @InjectConnection() private connection: Connection,
  ) {}

  @Post()
  @AuthJwt(CoupleGuard)
  @ApiOperation({ summary: '피드 작성(presinged 방식)' })
  @ApiResponseType(FeedPresenter)
  async createFeed(
    @User() user: UserModel,
    @Body() data: CreateFeedByPresignedDto,
  ) {
    const session = await this.connection.startSession();
    const useCase = this.createFeedUseCaseProxy.getInstance();

    try {
      session.startTransaction();

      const newFeed = await useCase.createFeed(
        user._id,
        user.channel_id,
        data,
        session,
      );

      await useCase.updateAlbumFeed(user.channel_id, newFeed._id, session);

      await session.commitTransaction();
      return new FeedPresenter(newFeed);
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  @Post('image/presigned')
  @AuthJwt(CoupleGuard)
  @ApiOperation({ summary: 'Presinged url 받아오기' })
  @ApiResponseType(undefined, true)
  async createFeedPresigned(
    @User() user: UserModel,
    @Body() data: PresignedDto,
  ) {
    const result = await this.presignedFeedImageuseCaseProxy
      .getInstance()
      .execute(user.channel_id, data.filenames);

    return result;
  }

  @Post('image/upload')
  @AuthJwt(CoupleGuard)
  @ApiOperation({ summary: '피드 작성 이미지 업로드 방식' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  @ApiResponseType(FeedPresenter)
  async createFeedByUpload(
    @User() user: UserModel,
    @Body() data: CreateFeedAndImageDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const imageBuffers = images.map((i) => i.buffer);
    const session = await this.connection.startSession();
    const useCase = this.createFeedUploadUseCaseProxy.getInstance();
    try {
      session.startTransaction();

      const imageUris = await useCase.uploadImages(
        user.channel_id,
        imageBuffers,
      );

      const newFeed = await useCase.createFeed(
        user._id,
        user.channel_id,
        {
          access_type: data.access_type,
          content: data.content,
          dating_date: data.dating_date,
        },
        imageUris,
        session,
      );

      await useCase.updateAlbumFeed(user.channel_id, newFeed._id, session);

      await session.commitTransaction();

      return new FeedPresenter(newFeed);
    } catch (err) {
      console.log(err);
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  @Post('like')
  @AuthJwt()
  @ApiOperation({ summary: '피드 좋아요' })
  @ApiResponseType()
  async likeFeed(@User() user: UserModel, @Query('id') id: string) {
    await this.likeFeedUseCaseProxy
      .getInstance()
      .like(new Types.ObjectId(id), user._id);
    return 'Success';
  }

  @Post('unlike')
  @AuthJwt()
  @ApiOperation({ summary: '피드 좋아요 해제' })
  @ApiResponseType()
  async dislikeFeed(@User() user: UserModel, @Query('id') id: string) {
    await this.likeFeedUseCaseProxy
      .getInstance()
      .removeLike(new Types.ObjectId(id), user._id);
    return 'Success';
  }

  @Get()
  @ApiOperation({ summary: 'id에 해당하는 피드 가져오기' })
  @ApiResponseType(FeedPresenter)
  async getFeedById(@Query('id') id: string) {
    const result = await this.getFeedUseCaseProxy
      .getInstance()
      .getFeed(new Types.ObjectId(id));

    if (!result) {
      return null;
    }
    return new FeedPresenter(result);
  }

  @Get('list')
  @ApiOperation({ summary: '피드 리스트(pagination)' })
  @ApiResponseType(FeedPresenter, true)
  async getFeedsByPagination(@Query() data: FeedPaginationDto) {
    const result = await this.getFeedUseCaseProxy
      .getInstance()
      .getFeedsByPagination(data);

    return result.map((i) => new FeedPresenter(i));
  }

  @Put()
  @ApiOperation({ summary: '피드 수정(변경 필드만)' })
  @AuthJwt(CoupleGuard)
  @ApiResponseType()
  async updateFeed(
    @User() user: UserModel,
    @Query('id') id: string,
    @Body() body: UpdateFeedDto,
  ) {
    const useCase = this.updateFeedUseCaseProxy.getInstance();
    const feedId = new Types.ObjectId(id);

    await useCase.permissionCheck(feedId, user.channel_id);

    await useCase.execute(user.channel_id, feedId, body);

    return 'Success';
  }

  @Delete()
  @ApiOperation({ summary: '피드 삭제' })
  @AuthJwt(CoupleGuard)
  @ApiResponseType()
  async deleteFeed(@User() user: UserModel, @Query('id') id: string) {
    const useCase = this.deleteFeedUseCaseProxy.getInstance();
    const feedId = new Types.ObjectId(id);
    await useCase.permissionCheck(feedId, user.channel_id);
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      await useCase.execute(feedId, session);

      await useCase.deleteFeedInAlbum(user.channel_id, feedId, session);

      await session.commitTransaction();

      return 'Success';
    } catch (err) {
      console.log(err);
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }
}
