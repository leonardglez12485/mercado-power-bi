/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UpdateUserDto, LoginUserDto, CreateUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRolesGuard } from './guards/user-roles.guard';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { ValidRoles } from './interfaces';



@ApiTags('Register')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('users')
  @ApiOperation({
    summary: 'This endpoint is only for ADMIN',
    description: '## IMPORTANT Only get the Active Users'
  })
  findAll() {
    return this.authService.findAll();
  }

  @Get('private')
  @UseGuards( AuthGuard())
  testingPrivateRoute(
   @GetUser() user: User,
   @GetUser('email') userEmail: string,
   @RawHeaders() rawHeaders: string [],
   @RawHeaders(1) token: string,
  ){

   return {
    ok: true,
    rawHeaders,
    token,
    user, 
    userEmail
   }
  }
 
  //@SetMetadata('roles',['admin', 'user-admin'])
  @Get('private2')
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRolesGuard)
  privateRute2(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      user 
   
     }
  }


  @Get('private3')
  @Auth()
  privateRute3(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      user 
   
     }
  }


// ===================================================
// ===================================================


}
