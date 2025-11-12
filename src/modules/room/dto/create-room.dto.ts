import {
    IsString,
    IsNotEmpty,
    IsMongoId,
    IsEnum,
    IsNumber,
    IsOptional,
    IsArray,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class CreateRoomDto {
    @IsMongoId()
    @IsNotEmpty()
    floorId: string;
  
    @IsMongoId()
    @IsNotEmpty()
    buildingId: string;
  
    @IsString()
    @IsNotEmpty()
    roomNumber: string;
  
    @IsEnum(['SINGLE', 'DOUBLE', 'TRIPLE', 'DORMITORY', 'SUITE'])
    @IsNotEmpty()
    roomType: string;
  
    @IsNumber()
    @IsNotEmpty()
    totalBeds: number;
  
    @IsNumber()
    @IsOptional()
    rentPerBed?: number;
  
    @IsArray()
    @IsOptional()
    amenities?: string[];
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsArray()
    @IsOptional()
    images?: string[];
  
    @IsNumber()
    @IsOptional()
    area?: number;
  }