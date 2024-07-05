/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Global } from '@nestjs/common';
import { CreateMercanciaDto } from './dto/create-mercancia.dto';
import { UpdateMercanciaDto } from './dto/update-mercancia.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Date, Model, isValidObjectId } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Departamento } from 'src/departamento/entities/departamento.entity';
import { Mercancia } from './entities/mercancia.entity';
import { listenerCount } from 'process';
import { parseFecha } from 'src/common/helpers/data.openAI';
import { Trabajador } from 'src/trabajador/entities/trabajador.entity';


@Injectable()
export class MercanciaService {

  constructor(
    @InjectModel(Mercancia.name) private readonly mercaModel: Model<Mercancia>,
    @InjectModel(Departamento.name) private readonly deptoModel: Model<Departamento>,
    private readonly configService: ConfigService,
  ) {

  }

  //=====================
  //Crear Mercancia Nueva
  //=====================
  async create(createMercanciaDto: CreateMercanciaDto) {
    createMercanciaDto.nombre = createMercanciaDto.nombre.toLocaleLowerCase();    
    createMercanciaDto.fechaEntrada = new Date()
    createMercanciaDto.disponible = true;
    //createMercanciaDto.trab = trab;
    if (await this.estaMercancia(createMercanciaDto.nombre)) {
      const merca = await this.mercaModel.findOneAndUpdate({ nombre: createMercanciaDto.nombre }, createMercanciaDto)
      return merca;
    }
    try {
      const merca = await this.mercaModel.create(createMercanciaDto);
      const dpto = await this.deptoModel.findById(createMercanciaDto.depto)
      const cantProd= dpto.cant_producto + 1;
      await this.deptoModel.findByIdAndUpdate(dpto._id, {cant_producto: cantProd, is_empty: false});
      return merca;
    } catch (error) {
      this.hadleException(error);
    }

  }

  //============================
  //Buscar todas las Mercancias
  //===========================
  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.mercaModel.find({ disponible: true })
      .populate({ path: 'depto', select: ['nombre']})
      .limit(limit)
      .skip(offset)
      .select('-__v')
   
  }

  //==================================
  //Buscar una mercancia en especifico
  //==================================
  async findOne(term: string) {
    let merca: Mercancia;
    //busqueda por ID
    if (!merca && isValidObjectId(term)) {
      merca = await this.mercaModel.findById(term);
    }
    //busqueda por nombre
    if (!merca) {
      merca = await this.mercaModel.findOne({ nombre: term.toLocaleLowerCase().trim() });
    }
    if (!merca) {
      throw new NotFoundException(`La mercancia ${term} no existe`);
    }

    return merca;
  }

  //====================
  //Actualizar Mercancia
  //====================
  async update(term: string, updateMercanciaDto: UpdateMercanciaDto) {
    const merca = await this.findOne(term);
    try {
      await merca.updateOne(updateMercanciaDto);
      return { ...merca.toJSON(), ...updateMercanciaDto };
    } catch (error) {
      this.hadleException(error)
    }
  }

  //===================
  //Eliminar Mercancia
  //==================
  async remove(term: string) {
    const merca = await this.findOne(term);
    const dpto = await this.deptoModel.findById(merca.depto);
    const cantProd= dpto.cant_producto - 1;
    await this.deptoModel.findByIdAndUpdate(dpto._id, {cant_producto: cantProd});
    merca.cantidad = 0;
    merca.disponible = false;
    //merca.depto = null;
    this.update(term, merca)
  }

  //======================
  //Manejando Los Errores
  //======================
  private hadleException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Mercancia exists in DB ${JSON.stringify(error.keyValue)}`);
    }
    console.log({ error });
    throw new InternalServerErrorException(`Can't create Mercado - Check server logs `);

  }
  //========================================
  //Comprobar si existe la mercancia agotada
  //========================================

  async estaMercancia(nombre: string) {
    let merca = await this.mercaModel.findOne({ nombre });
    if (merca) {
      if (merca.disponible) {
        throw new BadRequestException(`La mercancia ${merca.nombre} ya esxiste en la base de datos`);
      }
      return true;
    }
  }

  //==================================
  //Buscar Mercancia por departamento
  //==================================
  
  async mercaDepto(term: string) {
    let depto: Departamento;
    //busqueda por ID
    if (!depto && isValidObjectId(term)) {
      depto = await this.deptoModel.findById(term);
    }
    //busqueda por nombre
    if (!depto) {
      depto = await this.deptoModel.findOne({ nombre: term.toLocaleLowerCase().trim() });
    }
    if (!depto) {
      throw new NotFoundException(`El departamento ${term} no existe`);
    };
    return this.mercaModel.find({ depto: depto._id })
  }

   public async getMerca(){
    return await this.mercaModel.find();
  }
 
}

