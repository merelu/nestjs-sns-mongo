import { DevicePlatformEnum } from '@domain/common/enums/device-platform';
import { PickType } from '@nestjs/mapped-types';

export class DeviceInfoModel {
  device_token: string | null;
  device_token_timestamp: number | null;
  platform: DevicePlatformEnum;
}

export class AddDeviceInfoModel extends PickType(DeviceInfoModel, [
  'device_token',
  'device_token_timestamp',
  'platform',
] as const) {}
