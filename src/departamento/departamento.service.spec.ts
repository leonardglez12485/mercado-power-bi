import { ConfigService } from '@nestjs/config';
import { DepartamentoController } from './departamento.controller';
import { DepartamentoService } from './departamento.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Departamento } from './entities/departamento.entity';
import { getModelToken } from '@nestjs/mongoose';

const mokDepartamentoService = {};

describe('DepartamentoService', () => {
  let service: DepartamentoService;
  let dptoModel: Model<Departamento>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [DepartamentoController],
      providers: [
        DepartamentoService,
        ConfigService,
        {
          provide: getModelToken(Departamento.name),
          useValue: mokDepartamentoService,
        },
      ],
    }).compile();

    service = module.get<DepartamentoService>(DepartamentoService);
    dptoModel = module.get<Model<Departamento>>(
      getModelToken(Departamento.name),
    );
  });
  it('Servicios de Departamento', () => {
    expect(service).toBeDefined();
  });
  it('Modelos de Departamento', () => {
    expect(dptoModel).toBeDefined();
  });
});
