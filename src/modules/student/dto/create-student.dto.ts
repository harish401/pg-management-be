import {
    IsString,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    ValidateNested,
    IsEnum,
    IsDateString,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  class PersonalInfoDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;
  
    @IsString()
    @IsNotEmpty()
    lastName: string;
  
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    phone: string;
  
    @IsDateString()
    @IsOptional()
    dateOfBirth?: string;
  
    @IsEnum(['MALE', 'FEMALE', 'OTHER'])
    @IsOptional()
    gender?: string;
  
    @IsString()
    @IsOptional()
    photo?: string;
  
    @IsString()
    @IsOptional()
    aadharNumber?: string;
  
    @IsString()
    @IsOptional()
    parentName?: string;
  
    @IsString()
    @IsOptional()
    parentPhone?: string;
  
    @IsString()
    @IsOptional()
    emergencyContact?: string;
  }
  
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
  
  class AcademicInfoDto {
    @IsString()
    @IsOptional()
    institution?: string;
  
    @IsString()
    @IsOptional()
    course?: string;
  
    @IsString()
    @IsOptional()
    year?: string;
  
    @IsString()
    @IsOptional()
    studentId?: string;
  }
  
  export class CreateStudentDto {
    @ValidateNested()
    @Type(() => PersonalInfoDto)
    @IsNotEmpty()
    personalInfo: PersonalInfoDto;
  
    @ValidateNested()
    @Type(() => AddressDto)
    @IsOptional()
    permanentAddress?: AddressDto;
  
    @ValidateNested()
    @Type(() => AddressDto)
    @IsOptional()
    currentAddress?: AddressDto;
  
    @ValidateNested()
    @Type(() => AcademicInfoDto)
    @IsOptional()
    academicInfo?: AcademicInfoDto;
  
    @IsNumber()
    @IsNotEmpty()
    monthlyRent: number;
  
    @IsNumber()
    @IsOptional()
    securityDeposit?: number;
  
    @IsString()
    @IsOptional()
    notes?: string;
  }