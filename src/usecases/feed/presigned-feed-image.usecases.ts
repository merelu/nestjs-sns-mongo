import { IAwsS3Service } from '@domain/adapters/aws.s3.interface';
import { Types } from 'mongoose';

export class PresignedFeedImageUseCases {
  constructor(private readonly awsService: IAwsS3Service) {}

  async execute(channelId: Types.ObjectId, filenames: string[]) {
    const result = await Promise.all(
      filenames.map(async (filename) => {
        const path = `channel/${channelId.toString()}/album/${filename}`;
        return await this.awsService.generatePutPresignedUrl(path);
      }),
    ).catch((err) => {
      console.log(err);
      throw err;
    });

    return result;
  }
}
