import { IsString, IsNotEmpty, IsMongoId, IsOptional, IsObject } from 'class-validator';

export class CreateBedDto {
  @IsMongoId()
  @IsNotEmpty()
  roomId: string;

  @IsMongoId()
  @IsNotEmpty()
  floorId: string;

  @IsMongoId()
  @IsNotEmpty()
  buildingId: string;

  @IsString()
  @IsNotEmpty()
  bedNumber: string;

  @IsObject()
  @IsOptional()
  position?: {
    x: number;
    y: number;
    rotation: number;
  };

  @IsString()
  @IsOptional()
  description?: string;
}