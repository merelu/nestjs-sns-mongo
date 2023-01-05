import { IMAGE_BASE_URL } from '@domain/common/constants/image.baseurl';
import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';
import { IException } from '@domain/exceptions/exceptions.interface';
import { ImageModel } from '@domain/model/database/image';
import { IFeedRepository } from '@domain/repositories/feed.repository.interface';
import { UpdateFeedDto } from '@infrastructure/controllers/feed/feed.dto';
import { Types } from 'mongoose';

export class UpdateFeedUseCases {
  constructor(
    private readonly feedRepository: IFeedRepository,
    private readonly exceptionService: IException,
  ) {}

  async execute(
    channelId: Types.ObjectId,
    feedId: Types.ObjectId,
    data: UpdateFeedDto,
  ): Promise<void> {
    await this.feedRepository.updateFeedByUpdateQuery(feedId, {
      $set: {
        photos: data.filenames
          ? data.filenames.map((i) =>
              this.toImageModel(`channel/${channelId}/album/${i}`),
            )
          : undefined,
        access_type: data.access_type,
        content: data.content,
        dating_date: data.dating_date,
      },
    });
  }

  async permissionCheck(
    feedId: Types.ObjectId,
    channelId: Types.ObjectId,
  ): Promise<void> {
    const result = await this.feedRepository.findById(feedId);

    if (result && !result.channel_id.equals(channelId)) {
      throw this.exceptionService.forbiddenException({
        error_description: '수정 권한이 없는 유저입니다.',
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
      });
    }
  }

  private toImageModel(key: string): ImageModel {
    const result = new ImageModel();
    result.key = key;
    result.url = `${IMAGE_BASE_URL}/${key}`;

    return result;
  }
}
