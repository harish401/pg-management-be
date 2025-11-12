import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BuildingDocument = Building & Document;

@Schema({ timestamps: true })
export class Building {
  @Prop({ type: Types.ObjectId, ref: 'Entity', required: true })
  entityId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  address: string;

  @Prop({ default: 0 })
  totalFloors: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  description: string;

  @Prop({ type: [String] })
  images: string[];
}

export const BuildingSchema = SchemaFactory.createForClass(Building);

// Indexes
BuildingSchema.index({ entityId: 1 });
BuildingSchema.index({ isActive: 1 });