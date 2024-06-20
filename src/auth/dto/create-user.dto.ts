/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Role } from "../enums/role.enum";


export class CreateUserDto {

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({description: 'The password must have a Uppercase, lowercase letter and a number'})
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty({default:true, required: false})
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({default:'admin', required: false})
  @IsArray()
  @IsOptional()
  roles?: Role[];
}

