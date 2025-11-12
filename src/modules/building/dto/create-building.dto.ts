import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    IsArray,
  } from 'class-validator';
  
  export class CreateBuildingDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsOptional()
    address?: string;
  
    @IsNumber()
    @IsOptional()
    totalFloors?: number;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsArray()
    @IsOptional()
    images?: string[];
  }