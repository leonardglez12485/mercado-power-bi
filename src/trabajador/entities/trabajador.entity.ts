import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, SchemaTypes } from "mongoose";
import { User } from "src/auth/entities/user.entity";
import { Role } from "src/auth/enums/role.enum";
import { Departamento } from "src/departamento/entities/departamento.entity";


export type TrabajadorDocument = HydratedDocument<Trabajador>;
@Schema({
    timestamps: true,
})
export class Trabajador {

    @Prop({ required: true, unique: true, lowercase: true, trim: true})
    email: string;

    // @Prop({ required: true })
    // password: string;

    @Prop({ required: true })
    fullName: string;

    // @Prop({default: true})
    // isActive?: boolean;

    // @Prop({default: 'worker'})
    // roles?: Role[];
   
    @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true,})
    user: User;

    @Prop({ 
        unique: true
    })
    ci: number;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Departamento', required: true})
    depto: Departamento;

}

export const TrabajadorSchema = SchemaFactory.createForClass(Trabajador);
