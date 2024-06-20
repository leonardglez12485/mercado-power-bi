/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrabajadorService } from './trabajador.service';
import { CreateTrabajadorDto } from './dto/create-trabajador.dto';
import { UpdateTrabajadorDto } from './dto/update-trabajador.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from '../auth/decorators';
import { JwtPayloadInterface, ValidRoles } from '../auth/interfaces';

@ApiTags('Trabajador')
@Controller('trabajador')
//@Auth()
export class TrabajadorController {
  constructor(private readonly trabajadorService: TrabajadorService) {}

  @Post()
  //@Auth(ValidRoles.admin)
  create(
    @Body() createTrabajadorDto: CreateTrabajadorDto) {
    return this.trabajadorService.create(createTrabajadorDto);
  }

  @Get()
  //@Auth()
  findAll() {
    return this.trabajadorService.findAll();
  }

  @Get(':id')
  //@Auth()
  @ApiOperation({summary: 'Busca todos los trabajadores por cualquier termino de busqueda'})
  findOne(@Param('id') id: string) {
    return this.trabajadorService.findOne(id);
  }

  @Patch(':id')
 // @Auth(ValidRoles.admin, ValidRoles.super_admin)
  update(@Param('id') id: string, @Body() updateTrabajadorDto: UpdateTrabajadorDto) {
    return this.trabajadorService.update(id, updateTrabajadorDto);
  }

  @Delete(':id')
  //@Auth(ValidRoles.admin, ValidRoles.super_admin)
  remove(@Param('id') id: string) {
    return this.trabajadorService.remove(id);
  }
}
