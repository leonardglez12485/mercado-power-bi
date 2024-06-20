/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AssitantService } from './assistant.service';
import { AssitantController } from './assistant.controller';
import { TransferDataModule } from 'src/transfer-data/transfer-data.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Mercancia, MercanciaSchema } from 'src/mercancia/entities/mercancia.entity';


@Module({
  controllers: [AssitantController],
  providers: [AssitantService],
  imports: [
    MongooseModule.forFeature([
      {
       name: Mercancia.name,
       schema: MercanciaSchema,
      },
    ]),
    TransferDataModule
  ],
})
export class AssistantModule {}
