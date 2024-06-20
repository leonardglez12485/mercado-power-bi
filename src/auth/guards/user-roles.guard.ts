/* eslint-disable prettier/prettier */
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';



@Injectable()
export class UserRolesGuard implements CanActivate {
  
  constructor(
    private readonly reflector: Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

   const rolesValidos: string[] = this.reflector.get(META_ROLES, context.getHandler());
   console.log(rolesValidos)
   if (!rolesValidos || rolesValidos.length==0 ) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    if(!user) throw new NotFoundException('User Not Found!!!');

    for (const role of user.roles) {
      if(rolesValidos.includes(role)){
        return true;
      }
    }
   throw new ForbiddenException(`User ${user.email} need a valid Role!!!`);
  }
}
