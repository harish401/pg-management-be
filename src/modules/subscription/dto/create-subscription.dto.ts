import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsEnum,
    IsBoolean,
    IsOptional,
    ValidateNested,
    IsArray,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  class FeaturesDto {
    @IsNumber()
    @IsNotEmpty()
    maxBuildings: number;
  
    @IsNumber()
    @IsNotEmpty()
    maxStudents: number;
  
    @IsBoolean()
    @IsOptional()
    paymentTracking?: boolean;
  
    @IsBoolean()
    @IsOptional()
    reports?: boolean;
  
    @IsBoolean()
    @IsOptional()
    smsNotifications?: boolean;
  
    @IsBoolean()
    @IsOptional()
    customBranding?: boolean;
  
    @IsBoolean()
    @IsOptional()
    apiAccess?: boolean;
  
    @IsBoolean()
    @IsOptional()
    prioritySupport?: boolean;
  }
  
  export class CreateSubscriptionDto {
    @IsString()
    @IsNotEmpty()
    planName: string;
  
    @IsEnum(['BASIC', 'PRO', 'ENTERPRISE', 'CUSTOM'])
    @IsNotEmpty()
    planType: string;
  
    @IsNumber()
    @IsNotEmpty()
    price: number;
  
    @IsNumber()
    @IsNotEmpty()
    duration: number;
  
    @ValidateNested()
    @Type(() => FeaturesDto)
    @IsNotEmpty()
    features: FeaturesDto;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsArray()
    @IsOptional()
    highlights?: string[];
  }