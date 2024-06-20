import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getStraticProductImg(img: string) {
    const path = join(__dirname, '../../static/uploads', img);
    if (!existsSync(path))
      throw new BadRequestException(`No product found whit image ${img}`);
    return path;
  }
}
