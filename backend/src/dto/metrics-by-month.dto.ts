import { MonthMetrics } from './month-metrics.dto';

export class MetricsByMonth {
  private metrics: Record<number, MonthMetrics>;

  constructor() {
    this.metrics = {};
  }

  getMetricsForMonth(month: number): MonthMetrics {
    if (!this.metrics[month]) {
      this.metrics[month] = new MonthMetrics();
    }

    return this.metrics[month];
  }

  getMetrics(): Record<number, MonthMetrics> {
    return this.metrics;
  }
}
