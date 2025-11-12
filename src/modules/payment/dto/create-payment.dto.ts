import {
    IsString,
    IsNotEmpty,
    IsMongoId,
    IsNumber,
    IsDateString,
  } from 'class-validator';
  
  export class CreatePaymentDto {
    @IsMongoId()
    @IsNotEmpty()
    studentId: string;
  
    @IsMongoId()
    @IsNotEmpty()
    bedId: string;
  
    @IsString()
    @IsNotEmpty()
    month: string;
  
    @IsNumber()
    @IsNotEmpty()
    amount: number;
  
    @IsDateString()
    @IsNotEmpty()
    dueDate: string;
  }