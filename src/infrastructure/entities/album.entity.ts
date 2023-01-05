import { SchemaNames } from '@domain/common/constants/schema-names';
import { FeedModel } from '@domain/model/database/feed';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { CustomSchemaOptions } from './custom-schema.option';

export type AlbumDocument = Album & Document;

@Schema(CustomSchemaOptions)
export class Album {
  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: SchemaNames.channel,
    required: true,
  })
  channel_id: Types.ObjectId;

  @Prop({ type: [SchemaTypes.ObjectId], ref: SchemaNames.feed, default: [] })
  feed_ids: Types.ObjectId[];

  readonly feeds: FeedModel[];
  readonly created_at: Date;
  readonly updated_at: Date;
}

const _AlbumSchema = SchemaFactory.createForClass(Album);

_AlbumSchema.virtual('feeds', {
  ref: SchemaNames.user,
  localField: 'feed_ids',
  foreignField: '_id',
});

_AlbumSchema.set('toObject', { virtuals: true });
_AlbumSchema.set('toJSON', { virtuals: true });

export const AlbumSchema = _AlbumSchema;
