import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RoomDocument = Room & Document;

class BedPosition {
  @Prop({ type: Types.ObjectId, ref: 'Bed' })
  bedId: Types.ObjectId;

  @Prop()
  x: number;

  @Prop()
  y: number;

  @Prop({ default: 0 })
  rotation: number;
}

class RoomLayout {
  @Prop({ default: 800 })
  width: number;

  @Prop({ default: 600 })
  height: number;

  @Prop({ type: [BedPosition] })
  beds: BedPosition[];
}

@Schema({ timestamps: true })
export class Room {
  @Prop({ type: Types.ObjectId, ref: 'Floor', required: true })
  floorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Building', required: true })
  buildingId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Entity', required: true })
  entityId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  roomNumber: string;

  @Prop({
    type: String,
    enum: ['SINGLE', 'DOUBLE', 'TRIPLE', 'DORMITORY', 'SUITE'],
    default: 'SINGLE',
  })
  roomType: string;

  @Prop({ default: 1 })
  totalBeds: number;

  @Prop({ default: 0 })
  rentPerBed: number;

  @Prop({ type: [String], default: [] })
  amenities: string[];

  @Prop({ type: RoomLayout })
  layout: RoomLayout;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  description: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop()
  area: number; // in sq ft
}

export const RoomSchema = SchemaFactory.createForClass(Room);

// Indexes
RoomSchema.index({ floorId: 1 });
RoomSchema.index({ buildingId: 1 });
RoomSchema.index({ entityId: 1 });
RoomSchema.index({ roomNumber: 1, buildingId: 1 }, { unique: true });