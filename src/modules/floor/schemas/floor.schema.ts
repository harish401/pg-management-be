import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FloorDocument = Floor & Document;

@Schema({ timestamps: true })
export class Floor {
  @Prop({ type: Types.ObjectId, ref: 'Building', required: true })
  buildingId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Entity', required: true })
  entityId: Types.ObjectId;

  @Prop({ required: true })
  floorNumber: number;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: 0 })
  totalRooms: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const FloorSchema = SchemaFactory.createForClass(Floor);

// Indexes
FloorSchema.index({ buildingId: 1, floorNumber: 1 }, { unique: true });
FloorSchema.index({ entityId: 1 });