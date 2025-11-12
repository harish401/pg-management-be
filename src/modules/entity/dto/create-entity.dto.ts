import {
    IsString,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsObject,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  class AddressDto {
    @IsString()
    @IsOptional()
    street?: string;
  
    @IsString()
    @IsOptional()
    city?: string;
  
    @IsString()
    @IsOptional()
    state?: string;
  
    @IsString()
    @IsOptional()
    pincode?: string;
  
    @IsString()
    @IsOptional()
    country?: string;
  }
  
  class SubscriptionPlanDto {
    @IsString()
    @IsNotEmpty()
    planType: string;
  
    @IsOptional()
    startDate?: Date;
  
    @IsOptional()
    endDate?: Date;
  }
  
  class FeaturesDto {
    @IsOptional()
    maxBuildings?: number;
  
    @IsOptional()
    maxStudents?: number;
  
    @IsOptional()
    paymentTracking?: boolean;
  
    @IsOptional()
    reports?: boolean;
  
    @IsOptional()
    smsNotifications?: boolean;
  
    @IsOptional()
    customBranding?: boolean;
  }
  
  export class CreateEntityDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    contactPerson: string;
  
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    phone: string;
  
    @ValidateNested()
    @Type(() => AddressDto)
    @IsOptional()
    address?: AddressDto;
  
    @ValidateNested()
    @Type(() => SubscriptionPlanDto)
    @IsOptional()
    subscriptionPlan?: SubscriptionPlanDto;
  
    @ValidateNested()
    @Type(() => FeaturesDto)
    @IsOptional()
    features?: FeaturesDto;
  
    @IsString()
    @IsOptional()
    logo?: string;
  
    @IsString()
    @IsOptional()
    website?: string;
  }