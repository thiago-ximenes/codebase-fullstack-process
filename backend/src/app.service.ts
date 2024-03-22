import { Injectable } from '@nestjs/common';
import * as csvParser from 'csv-parser';
import * as xlsx from 'xlsx';
import { Subscriber } from './types/subscriber.type';
import { FileException } from './exceptions/file.exception';
import { MetricsByMonth } from './dto/metrics-by-month.dto';
import { MonthMetrics } from './dto/month-metrics.dto';

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

    if (!(file.mimetype in processes)) {
      throw FileException.invalidMimeType();
    }

    const process = processes[file.mimetype];

    const subscribers = await process(file);

    return this.calculateMetrics(subscribers);
  }

  private processCsv = async (
    file: Express.Multer.File,
  ): Promise<Subscriber[]> => {
    const subscribers: Subscriber[] = [];

    csvParser()
      .on('data', (subscriber: Subscriber) => {
        subscribers.push(this.parseSubscribersDate(subscriber));
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

    subscribers.forEach(this.parseSubscribersDate);

    return subscribers;
  };

  private calculateMetrics = (subscribers: Subscriber[]) => {
    const metricsByMonth = new MetricsByMonth();

    subscribers.forEach((subscriber) => {
      const month = subscriber['data início'].getMonth();
      const metrics = metricsByMonth.getMetricsForMonth(month);
      this.executeActionBasedOnSubscriberStatus(metrics, subscriber);
    });

    return metricsByMonth.getMetrics();
  };

  private executeActionBasedOnSubscriberStatus = (
    metrics: MonthMetrics,
    subscriber: Subscriber,
  ) => {
    const subscriberStatusActions = {
      Ativa: (metrics: MonthMetrics, subscriber: Subscriber) =>
        metrics.addActiveSubscriber(subscriber.valor),
      Cancelada: (metrics: MonthMetrics) => metrics.addCancelledSubscriber(),
    };

    const action = subscriberStatusActions[subscriber.status];
    if (action) {
      action(metrics, subscriber);
    }
  };

  private parseSubscribersDate = (subscriber: Subscriber) => {
    subscriber['data início'] = new Date(subscriber['data início']);
    subscriber['data status'] = new Date(subscriber['data status']);
    subscriber['data cancelamento'] = new Date(subscriber['data cancelamento']);

    return subscriber;
  };
}
