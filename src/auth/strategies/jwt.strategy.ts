import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadInterface } from "../interfaces/jwt-payload.interface";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
       @InjectModel(User.name) private userM: Model<UserDocument>,
       private readonly configService: ConfigService,
    // private readonly userService: UserService,
    // @InjectModel(CaslUserPermission.name) private readonly caslPermModel: Model<CaslUserPermissionDocument>
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      algorithms: ['HS256'],
    });
  }

  async validate(payload: JwtPayloadInterface):Promise<User> {
    const {_id} = payload;
    const userDB = await this.userM.findOne({_id});
    if(!userDB) throw new UnauthorizedException('Token not valid')
    // const permissionDB = await this.caslPermModel.findOne({email: userDB.email})
    //TODO fix if no user found response
    let user = userDB.toJSON()
    // user['permission'] = this.interpolate(JSON.stringify(permissionDB.permissions), user)
    if ( !user ) 
    throw new UnauthorizedException('Token not valid')
    if ( !user.isActive ) 
        throw new UnauthorizedException('User is inactive, talk with an admin');
    return user;    
  }

  private interpolate(permissions: string, user: any){
    return JSON.parse(permissions, (key, value) => {
      if(typeof value === 'string' && value.includes('${user.')){
        const prop = value.slice(7, -1);
        return user[prop];
      }
      return value
    })
  }
}