import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { parseFecha } from 'src/common/helpers/data.openAI';
import { Departamento } from 'src/departamento/entities/departamento.entity';
import { Mercancia } from 'src/mercancia/entities/mercancia.entity';

export interface MercaDasboard {
  Name: string;
  Department: string;
  Quanatity: number;
  Price: number;
  Worker: string;
  Date: string;
}

export interface DptoDasboard {
  Nombre: string;
  Trabajadores: number;
  Mercancia: number;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Mercancia.name)
    private readonly mercaModel: Model<Mercancia>,
    @InjectModel(Departamento.name)
    private readonly deptoModel: Model<Departamento>,
  ) {}

  //===========================
  //Send Data Merca to PowerBi
  //===========================
  async sendDataToPowerBI(data: MercaDasboard[]): Promise<void> {
    const powerBIAPIURL =
      'https://api.powerbi.com/beta/760fe82f-1c6d-4e38-9fa9-994e8f3fcb10/datasets/5e0ef43e-2bd1-489c-9a1c-d176d99cd271/rows?experience=power-bi&clientSideAuth=0&key=zpeyg%2BdYZraqwIP5UGW%2BvmHxg2AvgUlUKH%2FT%2B5%2FzuLrmvcMJ68xpGo%2BFcjYRdnXgbQsAZ%2BHdkkFkegA%2Ft35ITg%3D%3D';
    try {
      const response = await fetch(powerBIAPIURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${powerBIAPIKey}`
        },
        body: JSON.stringify({ rows: data }),
      });

      if (!response.ok) {
        throw new Error(
          `Error al enviar datos a Power BI: ${response.status} ${response.statusText}`,
        );
      }

      console.log('Datos enviados correctamente a Power BI.');
    } catch (error) {
      console.error('Error al enviar datos a Power BI:', error);
    }
  }

  async sendDataMerca(): Promise<MercaDasboard[]> {
    const mercancias = await this.mercaModel
      .find()
      .populate({ path: 'depto', select: 'nombre  -_id' })
      .populate({ path: 'trab', select: 'fullName  -_id' });
    const listMerca: MercaDasboard[] = [];
    for await (const item of mercancias) {
      listMerca.push({
        Name: item.nombre,
        Department: item.depto.nombre,
        Quanatity: item.cantidad,
        Price: item.precio,
        Worker: item.trab.fullName,
        Date: parseFecha(item.fechaEntrada),
      });
    }

    await this.sendDataToPowerBI(listMerca);
    return listMerca;
  }

  //===========================
  //Send Data Depto to PowerBi
  //===========================
  async sendDataDeptoPB(data: DptoDasboard[]): Promise<void> {
    const powerBIAPIURL =
      'https://api.powerbi.com/beta/760fe82f-1c6d-4e38-9fa9-994e8f3fcb10/datasets/d699bc16-f40d-40a5-aeeb-72bcf2b6724a/rows?experience=power-bi&key=VGCpZJcG4M%2BS5P3qGtZUY5nLUNXn3R%2FnkfDgIWB9wb7T5opY2SslzTKWEOeDaweJvFJ1UNp3NJP%2FI0Q2x3eREw%3D%3D';
    try {
      const response = await fetch(powerBIAPIURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${powerBIAPIKey}`
        },
        body: JSON.stringify({ rows: data }),
      });

      if (!response.ok) {
        throw new Error(
          `Error al enviar datos a Power BI: ${response.status} ${response.statusText}`,
        );
      }

      console.log('Datos enviados correctamente a Power BI.');
    } catch (error) {
      console.error('Error al enviar datos a Power BI:', error);
    }
  }
  async sendDataDepto(): Promise<DptoDasboard[]> {
    const mercancias = await this.deptoModel
      .find()
      .populate({ path: 'depto', select: 'nombre  -_id' })
      .populate({ path: 'trab', select: 'fullName  -_id' });
    const listMerca: DptoDasboard[] = [];
    for await (const item of mercancias) {
      listMerca.push({
        Nombre: item.nombre,
        Trabajadores: item.cant_trab,
        Mercancia: item.cant_producto,
      });
    }

    await this.sendDataDeptoPB(listMerca);
    return listMerca;
  }
}
