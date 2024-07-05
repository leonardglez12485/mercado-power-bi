/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { Departamento } from 'src/departamento/entities/departamento.entity';

export class CreateTrabajadorDto {
  @ApiProperty()
  @IsString()
  fullName: string;

  @IsNumber()
  @Min(11)
  @ApiProperty({ description: 'Recuerde que el CI debe tener 11 digitos' })
  ci: number;

  @IsMongoId()
  @ApiProperty({
    required: false,
    type: String,
    description: 'ID del Departamento al que pertenece',
  })
  depto: Departamento;

  // @IsMongoId()
  // @ApiProperty({ required: true, type: String, description: 'ID del Usuario al que pertenece' })
  // user: User;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  // @ApiProperty({ required: false, default:'user'})
  // roles?: Role[];
}
