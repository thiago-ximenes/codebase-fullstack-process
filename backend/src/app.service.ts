import { Injectable } from '@nestjs/common';
import * as csvParser from 'csv-parser';
import * as xlsx from 'xlsx';
import { FileException } from './exceptions/file.exception';
import { RawSubscriberType } from './types/raw-subscriber.type';
import { Metrics } from './dto/metrics.dto';
import { SubscriberDto } from './dto/subscriber.dto';

@Injectable()
export class AppService {
  private readonly csvMimeType = 'text/csv';
  private readonly xlsxMimeType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  async processFile(file: Express.Multer.File) {
    const processes: Record<
      string,
      (file: Express.Multer.File) => Promise<SubscriberDto[]>
    > = {
      [this.csvMimeType]: this.processCsv,
      [this.xlsxMimeType]: this.processXlsx,
    };

    if (!(file.mimetype in processes)) {
      throw FileException.invalidMimeType();
    }

    const process = processes[file.mimetype];

    const subscribers = await process(file);

    return this.calculateMetrics(subscribers);
  }

  private processCsv = async (
    file: Express.Multer.File,
  ): Promise<SubscriberDto[]> => {
    const subscribers: SubscriberDto[] = [];

    csvParser()
      .on('data', (subscriber: RawSubscriberType) => {
        subscribers.push(new SubscriberDto(subscriber));
      })
      .write(file.buffer);

    return subscribers;
  };

  private processXlsx = async (
    file: Express.Multer.File,
  ): Promise<SubscriberDto[]> => {
    const workbook = xlsx.read(file.buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const subscribers: RawSubscriberType[] = xlsx.utils.sheet_to_json(sheet, {
      raw: false,
    });

    return subscribers.map((subscriber) => new SubscriberDto(subscriber));
  };

  private calculateMetrics = (subscribers: SubscriberDto[]) => {
    const metrics = new Metrics();

    subscribers.forEach((subscriber) => {
      metrics.setSubscriber(subscriber);

      metrics.calculateMetrics();
    });

    return metrics.metrics;
  };
}
