/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, InternalServerErrorException, HttpStatus, HttpException, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto, LoginUserDto, CreateUserDto } from './dto';
import { User} from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Role } from './enums/role.enum';



@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userM: Model<User>,
    private readonly jwtService: JwtService
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = await this.userM.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      return {
        user,
        token: this.getJwtToken({_id: user._id.toString()})
     };
    } catch (error) {
      this.handleErrors(error);
    }

  }

  async findAll() {
    try {
      return await this.userM.find({ isActive: true });
    } catch (error) {
      console.log(error)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userM.findOne({ email: loginUserDto.email.toLowerCase() });
    if (!user.isActive) throw new HttpException('User is disabled', HttpStatus.FORBIDDEN);
    if (await (user.validatePassword(loginUserDto.password)) === false) throw new HttpException('Wrong credentials', HttpStatus.FORBIDDEN);
    let userType: Role[] = user.roles;
    if(!user) throw new UnauthorizedException(`Email ${loginUserDto.email} not valid`)
    return {
     user,
     token: this.getJwtToken({_id: user._id.toString()})
  };

  }

  private getJwtToken(payload: JwtPayloadInterface){
   const token = this.jwtService.sign(payload);
   return token;
  }
    

  //===========================
  //===Manejando los Errores===
  //===========================
  private handleErrors(error: any): never {
    if (error.code === 11000) throw new BadRequestException(error.detail, 'Email already exist in DB, please change it !!!');
    throw new InternalServerErrorException('Please check servers logs !!!');
  }
}
