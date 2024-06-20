import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { MercanciaModule } from 'src/mercancia/mercancia.module';
import { TrabajadorModule } from 'src/trabajador/trabajador.module';
import { DepartamentoModule } from 'src/departamento/departamento.module';
import { AuthModule } from 'src/auth/auth.module';
import { TrabajadorService } from 'src/trabajador/trabajador.service';


@Module({
  controllers: [SeedController],
  providers: [SeedService, TrabajadorService],
  imports:[
    DepartamentoModule,
    MercanciaModule,
    TrabajadorModule,
    AuthModule, 
  ],
  exports:[SeedService]
})
export class SeedModule {}
