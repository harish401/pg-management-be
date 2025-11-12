import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Entity', required: true })
  entityId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Bed', required: true })
  bedId: Types.ObjectId;

  @Prop({ required: true })
  month: string; // Format: YYYY-MM

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  dueDate: Date;

  @Prop()
  paidDate: Date;

  @Prop({
    type: String,
    enum: ['CASH', 'UPI', 'BANK_TRANSFER', 'CARD', 'CHEQUE', 'OTHER'],
  })
  paymentMode: string;

  @Prop({
    type: String,
    enum: ['PENDING', 'PAID', 'OVERDUE', 'PARTIAL', 'CANCELLED'],
    default: 'PENDING',
  })
  status: string;

  @Prop()
  transactionId: string;

  @Prop()
  remarks: string;

  @Prop()
  receiptUrl: string;

  @Prop({ default: 0 })
  lateFee: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop()
  collectedBy: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Indexes
PaymentSchema.index({ entityId: 1, month: 1 });
PaymentSchema.index({ studentId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ dueDate: 1 });