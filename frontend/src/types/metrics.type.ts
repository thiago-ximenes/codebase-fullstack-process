export type MrrMetric = {
  value: number;
  displayValue: string;
  totalSubscribers: number;
  month: string;
};

export type CrMetric = {
  cancellations: number;
  newSubscribers: number;
  totalSubscribers: number;
  rate: string;
  month: string;
};


export type MetricsType = {
  mrr: Record<number, Array<MrrMetric>>
  cr: Record<number, Array<CrMetric>>
}