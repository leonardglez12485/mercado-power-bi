/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/entities/user.entity';
import { Role } from 'src/auth/enums/role.enum';
import { CreateDepartamentoDto } from 'src/departamento/dto/create-departamento.dto';
import { Departamento } from 'src/departamento/entities/departamento.entity';
import { CreateMercanciaDto } from 'src/mercancia/dto/create-mercancia.dto';
import { Mercancia } from 'src/mercancia/entities/mercancia.entity';
import { CreateTrabajadorDto } from 'src/trabajador/dto/create-trabajador.dto';
import { Trabajador } from 'src/trabajador/entities/trabajador.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class SeedService {

 constructor(
  @InjectModel(Mercancia.name) private readonly mercaModel: Model<Mercancia>,
  @InjectModel(Departamento.name) private readonly deptoModel: Model<Departamento>,
  @InjectModel(Trabajador.name) private readonly trabModel: Model<Trabajador>,
  @InjectModel(User.name) private readonly userModel: Model<User>,
 ){} 

   //Seed 
   async excecuteSeed(){
    let trab: Trabajador;
    let dpto: Departamento;
    let merca: Mercancia;
    
    if(await this.deptoModel.find().countDocuments()===0){
      dpto = await this.excecuteDepartamento();
    }
    if(await this.trabModel.find().countDocuments()===0){
      trab = await this.excecuteTrabajador(dpto);
    }
    if(await this.mercaModel.find().countDocuments()===0){
      merca = await this.excecuteMercancia(dpto, trab);
    }
   }
//    async excecuteMercancia(): Promise<Mercancia> {
//     try {
//        let merca: CreateMercanciaDto = {
//         nombre: 'Refresco',
//         depto: null,
//         disponible: true,
//         cantidad: 500,
//         precio: 25.00,
//         fechaEntrada: new Date().toDateString()
//       }
//       return await this.mercaModel.create(merca);
//     } catch (error) {
//       throw error;
//     }
//  }

    //Seed Departamento
    async excecuteDepartamento() : Promise<Departamento>{
        try {
           let depto: CreateDepartamentoDto = {
            nombre: 'Bebidas Frias',
            cant_trab: 10,
            cant_producto: 1,
            is_empty: false 
          }
          const seedDepto = await this.deptoModel.create(depto);
          return seedDepto;
        } catch (error) {
          throw error;
        }   
     }

    //Seed trabajador
    async excecuteTrabajador(dep: Departamento): Promise<Trabajador>{
        try {
           let user: User={
            fullName: 'Test',
            email: 'test@gmail.com',
            password: '123456Aa.',
            roles: [Role.admin],
           }
           user.password = bcrypt.hashSync(user.password, 10);
           const newUser = await this.userModel.create(user);
           let trab: Trabajador = {
            fullName: 'Test',
            email: user.email,
            user: newUser, 
            ci: 74051219384,
            depto: dep,
          }
          const seedTrab= await this.trabModel.create(trab);
          return seedTrab;
        } catch (error) {
          throw error;
        }
     }

     async excecuteMercancia(dep: Departamento, trab: Trabajador): Promise<Mercancia>{
      try {
         let merca: CreateMercanciaDto = {
          nombre: 'Refresco Cola',
          depto: dep,
          disponible: true,
          cantidad: 1000,
          precio: 220.00,
          fechaEntrada: new Date(),
          trab: trab
        }
        const seedMerca =  await this.mercaModel.create(merca);
        return seedMerca;
      } catch (error) {
        throw error;
      }
   }
}
