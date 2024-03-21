import { Injectable } from '@nestjs/common';
import * as csvParser from 'csv-parser';
import * as xlsx from 'xlsx';
import { Subscriber } from './types/subscriber.type';

@Injectable()
export class AppService {
  private readonly csvMimeType = 'text/csv';
  private readonly xlsxMimeType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  async processFile(file: Express.Multer.File) {
    const processes: Record<
      string,
      (file: Express.Multer.File) => Promise<Subscriber[]>
    > = {
      [this.csvMimeType]: this.processCsv,
      [this.xlsxMimeType]: this.processXlsx,
    };

    const process = processes[file.mimetype];

    const subscribers = await process(file);

    return this.calculateMetrics(subscribers);
  }

  private processCsv = async (
    file: Express.Multer.File,
  ): Promise<Subscriber[]> => {
    const subscribers: Subscriber[] = [];

    csvParser()
      .on('data', (row) => {
        row['data início'] = new Date(row['data início']);
        row['data status'] = new Date(row['data status']);
        subscribers.push(row);
      })
      .write(file.buffer);

    return subscribers;
  };

  private processXlsx = async (
    file: Express.Multer.File,
  ): Promise<Subscriber[]> => {
    const workbook = xlsx.read(file.buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const subscribers: Subscriber[] = xlsx.utils.sheet_to_json(sheet, {
      raw: false,
    });

    subscribers.forEach((subscriber) => {
      subscriber['data início'] = new Date(subscriber['data início']);
      subscriber['data status'] = new Date(subscriber['data status']);
    });

    return subscribers;
  };

  private calculateMetrics = (subscribers: Subscriber[]) => {
    const metricsByMonth = {};

    subscribers.forEach((subscriber) => {
      const month = subscriber['data início'].getMonth();

      if (!metricsByMonth[month]) {
        metricsByMonth[month] = {
          mrr: 0,
          churnRate: 0,
          activeSubscribers: 0,
          cancelledSubscribers: 0,
        };
      }

      if (subscriber.status === 'Ativa') {
        metricsByMonth[month].mrr += Number(subscriber.valor);
        metricsByMonth[month].activeSubscribers++;
      } else if (subscriber.status === 'Cancelada') {
        metricsByMonth[month].cancelledSubscribers++;
      }

      metricsByMonth[month].churnRate =
        metricsByMonth[month].cancelledSubscribers /
        (metricsByMonth[month].activeSubscribers +
          metricsByMonth[month].cancelledSubscribers);
    });

    return metricsByMonth;
  };
}
