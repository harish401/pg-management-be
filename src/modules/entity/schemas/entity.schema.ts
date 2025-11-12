import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EntityDocument = Entity & Document;

class SubscriptionPlan {
  @Prop({ 
    type: String, 
    enum: ['BASIC', 'PRO', 'ENTERPRISE'],
    default: 'BASIC'
  })
  planType: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ default: true })
  isActive: boolean;
}

class Features {
  @Prop({ default: 1 })
  maxBuildings: number;

  @Prop({ default: 50 })
  maxStudents: number;

  @Prop({ default: true })
  paymentTracking: boolean;

  @Prop({ default: true })
  reports: boolean;

  @Prop({ default: false })
  smsNotifications: boolean;

  @Prop({ default: false })
  customBranding: boolean;
}

class Address {
  @Prop()
  street: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  pincode: string;

  @Prop()
  country: string;
}

@Schema({ timestamps: true })
export class Entity {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  contactPerson: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: Address })
  address: Address;

  @Prop({ type: SubscriptionPlan })
  subscriptionPlan: SubscriptionPlan;

  @Prop({ type: Features })
  features: Features;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  logo: string;

  @Prop()
  website: string;
}

export const EntitySchema = SchemaFactory.createForClass(Entity);

// Indexes
EntitySchema.index({ email: 1 });
EntitySchema.index({ isActive: 1 });