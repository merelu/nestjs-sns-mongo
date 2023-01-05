import { PickType } from '@nestjs/mapped-types';

export class ImageModel {
  key: string;
  url: string;
  created_at: Date;
  updated_at: Date;
}

export class AddImageModel extends PickType(ImageModel, [
  'key',
  'url',
] as const) {}
