/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as bcrypt from 'bcrypt';
import { Role } from "../enums/role.enum";


export type UserDocument = HydratedDocument<User>;
@Schema({
    timestamps: true,
})
export class User {
  
    @Prop({ required: true, unique: true, lowercase: true, trim: true})
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({default: true})
    isActive?: boolean;

    @Prop({default: 'admin'})
    roles?: Role[];


    //Functions
  validatePassword?: Function;

}
const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  delete obj.activationToken;
  return obj;
}

UserSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compareSync(password, this.password);
  };

export { UserSchema };