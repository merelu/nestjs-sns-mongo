import { SchemaOptions } from '@nestjs/mongoose';

export const CustomSchemaOptions: SchemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};
