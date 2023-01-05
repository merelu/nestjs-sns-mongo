export interface AwsConfig {
  getAwsS3AccessKey(): string;
  getAwsS3SecretKey(): string;
  getAwsS3Region(): string;
  getAwsPublicBucketName(): string;
  getAwsPrivateBucketName(): string;
}
