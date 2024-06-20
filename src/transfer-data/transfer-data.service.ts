/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import { Departamento } from 'src/departamento/entities/departamento.entity';
import { Mercancia } from 'src/mercancia/entities/mercancia.entity';
import { Trabajador } from 'src/trabajador/entities/trabajador.entity';



@Injectable()
export class TransferDataService {
    constructor(
        @InjectModel(Mercancia.name) private readonly mercaModel: Model<Mercancia>,
        @InjectModel(Departamento.name) private readonly deptoModel: Model<Departamento>,
        @InjectModel(Trabajador.name) private readonly trabModel: Model<Departamento>,
        private readonly configService: ConfigService,
      ) {
        
      }

    async getData(){
    const mercancia =  await this.mercaModel.find();
    const departamento = await this.deptoModel.find();
    const trabajadores = await this.trabModel.find();
    const data = {};
    data['mercancia'] = mercancia;
    data['departamentos']=departamento;
    data['trabajadores']=trabajadores;
    //
    //const data =(await this.mercaModel.find()).concat((await this.deptoModel.find()), await this.trabModel.find()); 
   // JSON.stringify(orders);
    const response= JSON.stringify(data);
    return JSON.parse(response); 
}

async generatePdf(jsonData: object, options?: any): Promise<Buffer> {
    const htmlPath = path.resolve(__dirname, 'pdf.html');
    fs.writeFileSync(htmlPath, this.generateHtmlFromJson(jsonData));

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf(options);

    await browser.close();
    fs.unlinkSync(htmlPath); // Delete the temporary HTML file

    return pdfBuffer;
  }

  private generateHtmlFromJson(jsonData: object): string {
    // Implement a HTML generation logic based on the JSON data
    // For example:
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>PDF Report</title>
        </head>
        <body>
          <h1>My PDF Report</h1>
          <pre>${JSON.stringify(jsonData, null, 2)}</pre>
        </body>
      </html>
    `;

    return html;
  }

}
