import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional, IsMongoId } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(['SUPER_ADMIN', 'ENTITY_ADMIN'])
  @IsNotEmpty()
  role: string;

  @IsMongoId()
  @IsOptional()
  entityId?: string;
}