import {
  addMonths,
  getDaysInMonth,
  getYear,
  isAfter,
  isSameMonth,
  startOfMonth,
} from 'date-fns';
import { SubscriberDto } from './subscriber.dto';
import { CrMetric } from '../types/cr-metric.type';
import { MrrMetric } from '../types/mrr-metric.type';

export class Metrics {
  private mrr: Record<number, Array<MrrMetric>> = {};
  private cr: Record<number, Array<CrMetric>> = {};

  private currentDate: Date;
  private nextCycleDate: Date;

  private year: number;
  private month: number;
  private monthName: string;

  private subscriber: SubscriberDto;

  setSubscriber(subscriber: SubscriberDto) {
    this.subscriber = subscriber;

    this.prepareStartDates(subscriber.startDate, subscriber.nextCycle);
  }
  calculateMetrics() {
    while (this.isInCycle) {
      this.prepareForYear();

      this.calculateCrMetrics();

      this.calculateMrrMetrics();

      this.addCurrentDate();
    }
  }

  get metrics() {
    return {
      cr: this.cr,
      mrr: this.mrr,
    };
  }

  private prepareStartDates(startDate: Date, nextCycleDate: Date) {
    this.currentDate = startOfMonth(startDate);
    this.nextCycleDate = startOfMonth(nextCycleDate);
  }

  private get isInCycle(): boolean {
    return (
      isAfter(this.nextCycleDate, this.currentDate) ||
      isSameMonth(this.nextCycleDate, this.currentDate)
    );
  }

  private addCurrentDate() {
    this.currentDate = addMonths(this.currentDate, 1);
  }

  private prepareForYear() {
    const year = getYear(this.currentDate);

    this.year = year;
    this.month = this.currentDate.getMonth();
    this.monthName = this.currentDate.toLocaleString('pt-BR', {
      month: 'long',
    });

    if (!this.mrr[year]) {
      this.mrr[year] = Array(12)
        .fill(null)
        .map(() => ({
          value: 0,
          displayValue: '',
          totalSubscribers: 0,
          month: '',
        }));
    }

    if (!this.cr[year]) {
      this.cr[year] = Array(12)
        .fill(null)
        .map(() => ({
          cancellations: 0,
          newSubscribers: 0,
          totalSubscribers: 0,
          rate: '',
          month: '',
        }));
    }
  }

  private calculateCrMetrics() {
    const actualCr = this.cr[this.year][this.month];
    actualCr.totalSubscribers += 1;

    if (isSameMonth(this.subscriber.cancelDate, this.currentDate)) {
      actualCr.cancellations += 1;
    }

    if (isSameMonth(this.subscriber.startDate, this.currentDate)) {
      actualCr.newSubscribers += 1;
    }

    actualCr.rate = Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 2,
    }).format(actualCr.cancellations / actualCr.totalSubscribers);

    actualCr.month = this.monthName;
  }

  private calculateMrrMetrics() {
    const dailyValue =
      (this.subscriber.value / this.subscriber.billingDays) *
      this.subscriber.billingFrequency;

    const actualMrr = this.mrr[this.year][this.month];

    actualMrr.value += dailyValue * getDaysInMonth(this.currentDate);

    actualMrr.month = this.monthName;
    actualMrr.displayValue = Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(actualMrr.value);

    actualMrr.totalSubscribers += 1;
  }
}
