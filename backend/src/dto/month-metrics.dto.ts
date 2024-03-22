export class MonthMetrics {
  mrr: number;
  churnRate: number;
  activeSubscribers: number;
  cancelledSubscribers: number;

  constructor() {
    this.mrr = 0;
    this.churnRate = 0;
    this.activeSubscribers = 0;
    this.cancelledSubscribers = 0;
  }

  addActiveSubscriber(value: string) {
    const valueToNumber = Number(value.replace(',', '.'));
    console.log('Adding active subscriber with value:', value);
    this.mrr += valueToNumber;
    this.activeSubscribers++;
    this.calculateChurnRate();
  }

  addCancelledSubscriber() {
    this.cancelledSubscribers++;
    this.calculateChurnRate();
  }

  private calculateChurnRate() {
    this.churnRate =
      this.cancelledSubscribers /
      (this.activeSubscribers + this.cancelledSubscribers);
  }
}
