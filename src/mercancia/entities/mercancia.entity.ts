/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes } from "mongoose";
import { Departamento } from "src/departamento/entities/departamento.entity";
import { Trabajador } from 'src/trabajador/entities/trabajador.entity';

export enum Unidades {
  UNIDAD= 'UNIDAD',
  KILOGRAMO= 'KILOGRAMO',
  CAJA= 'CAJA'
}

//export type MercanciaDocument = HydratedDocument<Mercancia>

@Schema({
  timestamps: true
}
)
export class Mercancia extends Document{

@Prop({ required: true, unique: true})
nombre: string;

@Prop({ type: SchemaTypes.ObjectId, ref: 'Departamento', required: false})
depto?: Departamento;

@Prop({ required: false, default: true})
disponible?: boolean;

@Prop({ required: true})
cantidad: number;

@Prop({ required: true})
precio: number;

@Prop({ required: false})
fechaEntrada?: Date;

@Prop({ required: false, unique: false, default: 'UNIDAD'})
unidades?: Unidades;

@Prop({ type: SchemaTypes.ObjectId, ref: 'Trabajador', required: false})
trab: Trabajador;

}

export const MercanciaSchema = SchemaFactory.createForClass(Mercancia);
