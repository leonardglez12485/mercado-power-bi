import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Mercancia,
  MercanciaSchema,
} from 'src/mercancia/entities/mercancia.entity';
import {
  Departamento,
  DepartamentoSchema,
} from 'src/departamento/entities/departamento.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mercancia.name, schema: MercanciaSchema },
      { name: Departamento.name, schema: DepartamentoSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
