/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DepartamentoService } from './departamento.service';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';


@ApiTags('Departamento')
@Controller('departamento')
//@Auth()
export class DepartamentoController {
  constructor(
    private readonly departamentoService: DepartamentoService
    ) {}

  @Post()
 // @Auth(ValidRoles.admin)
  create(@Body() createDepartamentoDto: CreateDepartamentoDto) {
    return this.departamentoService.create(createDepartamentoDto);
  }

  @Get()
  @ApiOperation({summary: 'La lista de departamentos del mercado'})
  //@Auth()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.departamentoService.findAll(paginationDto);
  }

  @Get(':term')
 // @Auth()
  findOne(@Param('term') term: string) {
    return this.departamentoService.findOne(term);
  }

  @Patch(':term')
  //@Auth(ValidRoles.admin, ValidRoles.super_admin)
  update(@Param('term') term: string, @Body() updateDepartamentoDto: UpdateDepartamentoDto) {
    return this.departamentoService.update(term, updateDepartamentoDto);
  }

  @Delete(':term')
 // @Auth(ValidRoles.admin, ValidRoles.super_admin)
  remove(@Param ('term') term: string) {
  return this.departamentoService.remove(term);
  }
}
