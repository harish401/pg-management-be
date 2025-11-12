import { IsString, IsNotEmpty, IsMongoId, IsNumber } from 'class-validator';

export class CreateFloorDto {
  @IsMongoId()
  @IsNotEmpty()
  buildingId: string;

  @IsNumber()
  @IsNotEmpty()
  floorNumber: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}