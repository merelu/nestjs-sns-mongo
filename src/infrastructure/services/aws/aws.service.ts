import { IAwsS3Service } from '@domain/adapters/aws.s3.interface';
import { AwsConfig } from '@domain/config/aws.interface';
import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import _ from 'lodash';
import { IException } from '@domain/exceptions/exceptions.interface';
import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { fromBuffer } from 'file-type';
import { v4 as uuid } from 'uuid';
@Injectable()
export class AwsService implements IAwsS3Service {
  private readonly awsS3: S3Client;
  constructor(
    private readonly awsConfig: AwsConfig,
    private readonly exceptionService: IException,
  ) {
    this.awsS3 = new S3Client({
      credentials: {
        accessKeyId: this.awsConfig.getAwsS3AccessKey(),
        secretAccessKey: this.awsConfig.getAwsS3SecretKey(),
      },
      region: this.awsConfig.getAwsS3Region(),
    });
  }

  async uploadImage(dataBuffers: Buffer, path: string): Promise<string> {
    return await this.uploadFileToS3(
      dataBuffers,
      path,
      this.awsConfig.getAwsPublicBucketName(),
    );
  }

  async uploadImages(dataBuffers: Buffer[], path: string): Promise<string[]> {
    const result = await Promise.all(
      _.map(dataBuffers, async (i) => {
        return await this.uploadFileToS3(
          i,
          this.generateKey(path),
          this.awsConfig.getAwsPublicBucketName(),
        );
      }),
    ).catch((err) => {
      console.log(err);
      throw err;
    });

    return result;
  }

  async generateGetPresignedUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.awsConfig.getAwsPublicBucketName(),
      Key: key,
    });
    return await getSignedUrl(this.awsS3, command, { expiresIn: 86400 });
  }

  async generatePutPresignedUrl(key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.awsConfig.getAwsPublicBucketName(),
      Key: key,
      ContentType: 'image/*',
    });
    return await getSignedUrl(this.awsS3, command, { expiresIn: 3600 });
  }

  private async uploadFileToS3(
    buffer: Buffer,
    key: string,
    bucketName: string,
  ): Promise<string> {
    try {
      const parsedBuffer = await fromBuffer(buffer);

      const putObject = new PutObjectCommand({
        Bucket: bucketName,
        Body: buffer,
        Key: key,
        ContentType: `image/${parsedBuffer?.ext}`,
      });
      await this.awsS3.send(putObject);
    } catch (err) {
      console.log(err);
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_description: '이미지 업로드 실패',
      });
    }

    return key;
  }

  private generateKey(path: string): string {
    return `${path}/${uuid()}_${Date.now()}`;
  }

  // generateUrlByPublicBucket(key: string) {
  //   return `https://${this.awsConfig.getAwsPublicBucketName()}.s3.${
  //     this.awsConfig.getAwsS3Region
  //   }.amazonaws.com/${key}`;
  // }
}
