/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTrabajadorDto } from './dto/create-trabajador.dto';
import { UpdateTrabajadorDto } from './dto/update-trabajador.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Trabajador } from './entities/trabajador.entity';
import { Model, isValidObjectId } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from 'src/auth/entities/user.entity';
import { Role } from 'src/auth/enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TrabajadorService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Trabajador.name) private readonly trabModel: Model<Trabajador>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.getOrThrow<number>('default_limits')
  }

  //=========================
  //Crear un nuevo trabajador
  //=========================
  async create(dto: CreateTrabajadorDto): Promise<Trabajador> {
    dto.fullName = dto.fullName.toLocaleLowerCase();
    const userExist = await this.userModel.findOne({ email: dto.email });
    const profile = await this.trabModel.findOne({ email: dto.email });
    if (userExist || profile) throw new BadRequestException('email is already taken')

    try {
      const user: User = {
        email: dto.email,
        password: '123456Aa.',
        roles: [Role.admin],
        fullName: dto.fullName
      }
      user.password = bcrypt.hashSync(user.password, 10);
      const newUser = await this.userModel.create(user);
      let newTrab: Trabajador = {
        ci: dto.ci,
        depto: dto.depto,
        user: newUser,
        email: dto.email,
        fullName: dto.fullName
      }

      const trab = await this.trabModel.create(newTrab);
      return trab;

    } catch (error) {
      this.hadleException(error);
    }
  }
  //===================
  //Buscar Trabajdaores
  //===================
  findAll() {
    return this.trabModel.find();
  }

  //====================
  //Buscar un trabajador
  //====================

  async findOne(term: string) {
    let trab: Trabajador;
    //busqueda por ID
    if (!trab && isValidObjectId(term)) {
      trab = await this.trabModel.findById(term);
    }
    //busqueda por nombre
    if (!trab) {
      trab = await this.trabModel.findOne({ nombre: term.toLocaleLowerCase().trim() });
    }
    //busqueda por CI
    if (!trab) {
      trab = await this.trabModel.findOne({ ci: +term });
    }
    if (!trab) {
      throw new NotFoundException(`La mercancia ${term} no existe`);
    }

    return trab;
  }

  //=======================
  //Actualiza un trabajador
  //=======================
  async update(term: string, updateTrabajadorDto: UpdateTrabajadorDto) {
    const trab: Trabajador = await this.findOne(term);
    try {
      // await trab.updateOne(updateTrabajadorDto);
      // return { ...trab.toJSON(), ...updateTrabajadorDto };
    } catch (error) {
      this.hadleException(error)
    }
  }

  //=======================
  //Elimina un trabajador
  //=======================

  async remove(term: string) {
    const { deletedCount } = await this.trabModel.deleteOne({ _id: term });
    if (deletedCount === 0) {
      throw new BadRequestException(`Trabajador whit ID: ${term} not Found !!!!`);
    }
  }

  //============================
  //Comprueba si existe el email
  //=============================
  private estaByEmail(email: string) {
    const user = this.userModel.find({ email });
    if (user) throw new BadRequestException('Email exist in DB !!!');
    return true;
  }


  //======================
  //Manejando Los Errores
  //======================
  private hadleException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`${JSON.stringify(error.keyValue)}`);
    }
    console.log({ error });
    throw new InternalServerErrorException(`Can't create Trabajador - Check server logs `);

  }
}
