/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TrabajadorService } from './trabajador.service';
import { TrabajadorController } from './trabajador.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Trabajador, TrabajadorSchema } from './entities/trabajador.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { Departamento, DepartamentoSchema } from 'src/departamento/entities/departamento.entity';

@Module({
  controllers: [TrabajadorController],
  providers: [TrabajadorService],
  imports:[
    MongooseModule.forFeature([
      {
       name: Trabajador.name,
       schema: TrabajadorSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
       },
       {
        name: Departamento.name,
        schema: DepartamentoSchema,
       }
    ]),
    ConfigModule, 
    AuthModule,
  ],
  exports:[
    MongooseModule,
    TrabajadorModule
  ],
})
export class TrabajadorModule {}
