/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { TransferDataService } from './transfer-data.service';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Transfer Data')
@Controller('transfer-data')
export class TransferDataController {
  constructor(private readonly transferDataService: TransferDataService) {}
  @Get('get-json')
  async getOrdersJSON(): Promise<string> {
    return this.transferDataService.getData();
  }

  @Post('generate')
  async generatePdfReport(@Res() res): Promise<void> {
    const jsonData = await Object(this.getOrdersJSON());
    console.log(jsonData)
    const pdfBuffer = await this.transferDataService.generatePdf(jsonData, {
      format: 'A4',
      landscape: false,
      name: 'Mercado',
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=report.pdf`,
    );
    res.send(pdfBuffer);
  }
}
