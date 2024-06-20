import { Document} from 'mongoose'
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";



@Schema()
export class Departamento extends Document {

    @Prop({
        unique: true,
       })
    nombre:string;

    @Prop({})
    cant_trab:number;

    @Prop({default: 0, required: false})
    cant_producto?:number;

    @Prop({default: true, required: false})
    is_empty?: boolean;
}

export const DepartamentoSchema = SchemaFactory.createForClass(Departamento);


