import { Module } from '@nestjs/common';
import { TrabajadorService } from './trabajador.service';
import { TrabajadorController } from './trabajador.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Trabajador, TrabajadorSchema } from './entities/trabajador.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TrabajadorController],
  providers: [TrabajadorService],
  imports:[
    MongooseModule.forFeature([
      {
       name: Trabajador.name,
       schema: TrabajadorSchema,
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
