import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsOptional,
    IsNumber,
    IsDateString,
  } from 'class-validator';
  
  export class MarkPaidDto {
    @IsDateString()
    @IsOptional()
    paidDate?: string;
  
    @IsEnum(['CASH', 'UPI', 'BANK_TRANSFER', 'CARD', 'CHEQUE', 'OTHER'])
    @IsNotEmpty()
    paymentMode: string;
  
    @IsString()
    @IsOptional()
    transactionId?: string;
  
    @IsString()
    @IsOptional()
    remarks?: string;
  
    @IsString()
    @IsOptional()
    receiptUrl?: string;
  
    @IsNumber()
    @IsOptional()
    lateFee?: number;
  
    @IsNumber()
    @IsOptional()
    discount?: number;
  
    @IsString()
    @IsOptional()
    collectedBy?: string;
  }