import { SchemaNames } from '@domain/common/constants/schema-names';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { CustomSchemaOptions } from './custom-schema.option';

export type CoupleInfoDocument = CoupleInfo & Document;

@Schema(CustomSchemaOptions)
export class Anniversary {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Date, required: true })
  datetime: Date;

  readonly _id: Types.ObjectId;
  readonly created_at: Date;
  readonly updated_at: Date;
}

export const AnniversarySchema = SchemaFactory.createForClass(Anniversary);

@Schema(CustomSchemaOptions)
export class CoupleInfo {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SchemaNames.channel,
    required: true,
    unique: true,
  })
  channel_id: Types.ObjectId;

  @Prop({ type: [AnniversarySchema], default: [] })
  anniversaries: Anniversary[];

  @Prop({ type: Date, default: null })
  love_day: Date;

  readonly created_at: Date;
  readonly updated_at: Date;
}

const _CoupleInfoSchema = SchemaFactory.createForClass(CoupleInfo);

export const CoupleInfoSchema = _CoupleInfoSchema;
