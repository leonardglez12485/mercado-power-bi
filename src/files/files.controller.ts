import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFiler, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';



@ApiTags('Files')
@Controller('files')
export class FilesController {
  private hostAPI: string;
  constructor(
    private readonly filesService: FilesService,
    ) { 
      this.hostAPI = process.env.HOST_API;
    }

  @Get('mercancia/:imageName')
  findMercanciaImage(
    @Res() res: Response,
    @Param('imageName') imageName: string) {
    const path = this.filesService.getStraticProductImg(imageName)
    res.sendFile(path);
  }


  @Post('mercancia')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFiler,
    //limits:{fileSize: 1000},
    storage: diskStorage({
      destination: './static/uploads',
      filename: fileNamer,
    }),

  }))
  uploadFiles(
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) throw new BadRequestException('Make sure that the file is an Valid Image!!!!!');

    const secureURL = `${this.hostAPI}/files/mercancia/${file.filename}`
    return { secureURL};
  }

}
