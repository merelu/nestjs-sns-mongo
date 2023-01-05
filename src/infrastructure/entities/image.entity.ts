import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Image {
  @Prop({ type: String, default: null })
  key: string;

  @Prop({ type: String, default: null })
  url: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
