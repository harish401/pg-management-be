import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

class Features {
  @Prop()
  maxBuildings: number;

  @Prop()
  maxStudents: number;

  @Prop()
  paymentTracking: boolean;

  @Prop()
  reports: boolean;

  @Prop()
  smsNotifications: boolean;

  @Prop()
  customBranding: boolean;

  @Prop()
  apiAccess: boolean;

  @Prop()
  prioritySupport: boolean;
}

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ required: true, unique: true, trim: true })
  planName: string;

  @Prop({
    type: String,
    enum: ['BASIC', 'PRO', 'ENTERPRISE', 'CUSTOM'],
    required: true,
  })
  planType: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  duration: number; // in months

  @Prop({ type: Features, required: true })
  features: Features;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  description: string;

  @Prop({ type: [String], default: [] })
  highlights: string[];
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

// Indexes
SubscriptionSchema.index({ planType: 1 });
SubscriptionSchema.index({ isActive: 1 });