import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BedDocument = Bed & Document;

@Schema({ timestamps: true })
export class Bed {
  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  roomId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Floor', required: true })
  floorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Building', required: true })
  buildingId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Entity', required: true })
  entityId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  bedNumber: string;

  @Prop({ default: false })
  isOccupied: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Student', default: null })
  studentId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED'],
    default: 'AVAILABLE',
  })
  status: string;

  @Prop({ type: Object })
  position: {
    x: number;
    y: number;
    rotation: number;
  };

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  description: string;
}

export const BedSchema = SchemaFactory.createForClass(Bed);

// Indexes
BedSchema.index({ roomId: 1 });
BedSchema.index({ entityId: 1 });
BedSchema.index({ status: 1 });
BedSchema.index({ bedNumber: 1, roomId: 1 }, { unique: true });