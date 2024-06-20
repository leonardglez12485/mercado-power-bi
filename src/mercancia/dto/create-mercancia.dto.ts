/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsDecimal, IsInt, IsMongoId, IsNotEmpty, IsNotIn, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Departamento } from "src/departamento/entities/departamento.entity";
import { Unidades } from "../entities/mercancia.entity";
import { Trabajador } from "src/trabajador/entities/trabajador.entity";


export class CreateMercanciaDto {

    @IsString()
    @IsNotEmpty()
    nombre: string;

  
    @IsMongoId()
    @IsOptional()
    @ApiProperty({type: String, description: 'Id del Departamento al que pertence la Mercancia'})
    depto?: Departamento;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false, description: 'Verifica que el producto esta disponible: true por defecto'})
    disponible?: boolean;

    @IsInt()
    @Min(1)
    cantidad: number;

    @Min(1)
    @IsNumber()
    precio: number;

    @IsOptional()
    @ApiProperty({required: false})
    fechaEntrada?: Date;

    @IsOptional()
    @ApiProperty({description: 'Describe la unidad de la mercancia' })
    @ApiProperty({required: false})
    unidades?: Unidades;

    @ApiProperty({type: String, description: 'Trabajadro que le dio entrada a la Mercancia', required: true })
    @IsMongoId()
    trab: Trabajador;
}
