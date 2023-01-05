export interface IAwsS3Service {
  uploadImage(dataBuffer: Buffer, path: string): Promise<string>;
  uploadImages(dataBuffers: Buffer[], path: string): Promise<string[]>;
  generateGetPresignedUrl(key: string): Promise<string>;
  generatePutPresignedUrl(key: string): Promise<string>;
}
