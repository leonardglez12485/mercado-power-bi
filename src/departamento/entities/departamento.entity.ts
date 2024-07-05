/* eslint-disable prettier/prettier */
import { Document, HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DeptoDocument = HydratedDocument<Departamento>;
@Schema()
export class Departamento extends Document {
  @Prop({
  })
  nombre: string;

  @Prop({})
  cant_trab: number;

  @Prop({ default: 0, required: false })
  cant_producto?: number;

  @Prop({ default: true, required: false })
  is_empty?: boolean;
}

export const DepartamentoSchema = SchemaFactory.createForClass(Departamento);
