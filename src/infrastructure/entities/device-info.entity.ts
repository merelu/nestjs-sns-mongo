import { DevicePlatformEnum } from '@domain/common/enums/device-platform';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
  timestamps: false,
})
export class DeviceInfo {
  @Prop({ type: String, default: null })
  device_token: string | null;

  @Prop({ type: Number, default: null })
  device_token_timestamp: number | null;

  @Prop({ type: Number, enum: DevicePlatformEnum, required: true })
  platform: DevicePlatformEnum;
}

export const DeviceInfoSchema = SchemaFactory.createForClass(DeviceInfo);
