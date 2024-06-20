/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TransferDataService } from './transfer-data.service';
import { TransferDataController } from './transfer-data.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Mercancia, MercanciaSchema } from 'src/mercancia/entities/mercancia.entity';
import { DepartamentoModule } from 'src/departamento/departamento.module';
import { AuthModule } from 'src/auth/auth.module';
import { Departamento, DepartamentoSchema } from 'src/departamento/entities/departamento.entity';
import { Trabajador, TrabajadorSchema } from 'src/trabajador/entities/trabajador.entity';
import { MercanciaModule } from 'src/mercancia/mercancia.module';

@Module({
  controllers: [TransferDataController],
  providers: [TransferDataService],
  imports:[
    ConfigModule,
    MongooseModule.forFeature([
      {
       name: Mercancia.name,
       schema: MercanciaSchema,
      },
      {
        name: Departamento.name,
        schema: DepartamentoSchema,
       },
       {
        name: Trabajador.name,
        schema: TrabajadorSchema,
       },

    ]),
    MercanciaModule,
    DepartamentoModule,
    TransferDataModule,
    AuthModule
  ],
  exports: [TransferDataService],
})
export class TransferDataModule {}
