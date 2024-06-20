import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsDecimal, IsInt, IsOptional, IsString, Max, Min, MinLength } from "class-validator";


export class CreateDepartamentoDto {

    @IsString()
    @MinLength(3)
    nombre: string;

    @Min(5)
    @Max(15)
    @IsInt()
    cant_trab: number;

    @Min(0)
    @IsInt()
    @IsOptional()
    cant_producto?: number;
 
    @IsBoolean()
    @ApiProperty({ description: 'Describe si tiene algun producto en venta' })
    @IsOptional()
    is_empty?: boolean;
}
