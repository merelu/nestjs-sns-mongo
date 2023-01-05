import { IAwsS3Service } from '@domain/adapters/aws.s3.interface';
import { IMAGE_BASE_URL } from '@domain/common/constants/image.baseurl';
import { CreateFeedModel, FeedModel } from '@domain/model/database/feed';
import { ImageModel } from '@domain/model/database/image';
import { IAlbumRepository } from '@domain/repositories/album.repository.interface';
import { IFeedRepository } from '@domain/repositories/feed.repository.interface';
import { CreateFeedDto } from '@infrastructure/controllers/feed/feed.dto';
import { ClientSession, Types } from 'mongoose';

export class CreateFeedUploadUseCases {
  constructor(
    private readonly feedRepository: IFeedRepository,
    private readonly albumRepository: IAlbumRepository,
    private readonly awsService: IAwsS3Service,
  ) {}

  async createFeed(
    userId: Types.ObjectId,
    channelId: Types.ObjectId,
    data: CreateFeedDto,
    keys: string[],
    session?: ClientSession,
  ): Promise<FeedModel> {
    const newFeedModel = new CreateFeedModel();
    newFeedModel.access_type = data.access_type;
    newFeedModel.channel_id = channelId;
    newFeedModel.content = data.content;
    newFeedModel.dating_date = data.dating_date;
    newFeedModel.writer_id = userId;
    newFeedModel.photos = keys.map((i) => this.toImageModel(i));

    return await this.feedRepository.insert(newFeedModel, session);
  }

  async updateAlbumFeed(
    channelId: Types.ObjectId,
    feedId: Types.ObjectId,
    session?: ClientSession,
  ) {
    await this.albumRepository.updateAlbumFeed(channelId, feedId, session);
  }

  async uploadImages(
    channelId: Types.ObjectId,
    images: Buffer[],
  ): Promise<string[]> {
    const result = await this.awsService.uploadImages(
      images,
      `channel/${channelId.toString()}/album`,
    );

    return result;
  }

  private toImageModel(key: string): ImageModel {
    const result = new ImageModel();
    result.key = key;
    result.url = `${IMAGE_BASE_URL}/${key}`;

    return result;
  }
}
