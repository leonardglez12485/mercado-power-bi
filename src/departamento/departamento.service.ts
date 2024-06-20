/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, isValidObjectId } from 'mongoose';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';
import { Departamento } from './entities/departamento.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class DepartamentoService {
  constructor(
    @InjectModel(Departamento.name)
    private readonly dptoModel: Model<Departamento>,
    private readonly configService: ConfigService,
  ) {}

  //========================
  //Crear Nuevo Departamento
  //========================
  async create(createDepartamentoDto: CreateDepartamentoDto) {
    createDepartamentoDto.nombre =
      createDepartamentoDto.nombre.toLocaleLowerCase();
    try {
      const depto = await this.dptoModel.create(createDepartamentoDto);
      return depto;
    } catch (error) {
      this.hadleException(error);
    }
  }

  //==============================
  //Buscar todos los Departamentos
  //==============================
  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.dptoModel.find().limit(limit).skip(offset).select('-__v');
  }

  //======================
  //Buscar un Departamento
  //======================
  async findOne(term: string) {
    let depto: Departamento;
    //busqueda por ID
    if (!depto && isValidObjectId(term)) {
      depto = await this.dptoModel.findById(term);
    }
    //busqueda por nombre
    if (!depto) {
      depto = await this.dptoModel.findOne({
        nombre: term.toLocaleLowerCase().trim(),
      });
    }
    if (!depto) {
      throw new NotFoundException(`El departamento ${term} no existe`);
    }

    return depto;
  }

  //=======================
  //Actualizar Departamento
  //=======================
  async update(term: string, updateDepartamentoDto: UpdateDepartamentoDto) {
    const depto = await this.findOne(term);
    try {
      await depto.updateOne(updateDepartamentoDto);
      return { ...depto.toJSON(), ...updateDepartamentoDto };
    } catch (error) {
      this.hadleException(error);
    }
  }

  //=====================
  //Eliminar Departamento
  //=====================
  async remove(term: string) {
    const { deletedCount } = await this.dptoModel.deleteOne({ _id: term });
    if (deletedCount === 0) {
      throw new BadRequestException(
        `Departamento whit ID: ${term} not Found !!!!`,
      );
    }
  }

  //======================
  //Manejando Los Errores
  //======================
  private hadleException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Mercado exists in DB ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log({ error });
    throw new InternalServerErrorException(
      `Can't create Mercado - Check server logs `,
    );
  }
}
