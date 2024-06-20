/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DepartamentoService } from './departamento.service';
import { DepartamentoController } from './departamento.controller';
import {
  Departamento,
  DepartamentoSchema,
} from './entities/departamento.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [DepartamentoController],
  providers: [DepartamentoService, ConfigService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Departamento.name,
        schema: DepartamentoSchema,
      },
    ]),
    AuthModule,
  ],
  exports: [DepartamentoModule, MongooseModule],
})
export class DepartamentoModule {}
