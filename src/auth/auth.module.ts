import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Trabajador, TrabajadorSchema } from 'src/trabajador/entities/trabajador.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({ 
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Trabajador.name, schema: TrabajadorSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('ACCES_STOKEN_EXPIRE'), algorithm: 'HS256' }
      })
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController, ],
  exports: [JwtModule, JwtStrategy, PassportModule, MongooseModule]


})
export class AuthModule { }
