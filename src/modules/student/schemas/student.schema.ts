import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentDocument = Student & Document;

class PersonalInfo {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  dateOfBirth: Date;

  @Prop({ enum: ['MALE', 'FEMALE', 'OTHER'] })
  gender: string;

  @Prop()
  photo: string;

  @Prop()
  aadharNumber: string;

  @Prop()
  parentName: string;

  @Prop()
  parentPhone: string;

  @Prop()
  emergencyContact: string;
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

class AcademicInfo {
  @Prop()
  institution: string;

  @Prop()
  course: string;

  @Prop()
  year: string;

  @Prop()
  studentId: string;
}

@Schema({ timestamps: true })
export class Student {
  @Prop({ type: Types.ObjectId, ref: 'Entity', required: true })
  entityId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Bed', default: null })
  bedId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'Room', default: null })
  roomId?: Types.ObjectId | null;

  @Prop({ type: PersonalInfo, required: true })
  personalInfo: PersonalInfo;

  @Prop({ type: Address })
  permanentAddress: Address;

  @Prop({ type: Address })
  currentAddress: Address;

  @Prop({ type: AcademicInfo })
  academicInfo: AcademicInfo;

  @Prop()
  allocatedOn: Date;

  @Prop()
  vacatedOn: Date;

  @Prop({ required: true })
  monthlyRent: number;

  @Prop({ default: 0 })
  securityDeposit: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [String], default: [] })
  documents: string[];

  @Prop()
  notes: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

// Indexes
StudentSchema.index({ entityId: 1 });
StudentSchema.index({ 'personalInfo.email': 1 });
StudentSchema.index({ 'personalInfo.phone': 1 });
StudentSchema.index({ bedId: 1 });
StudentSchema.index({ isActive: 1 });