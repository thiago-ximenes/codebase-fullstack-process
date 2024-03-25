import { RawSubscriberType } from '../types/raw-subscriber.type';

export class SubscriberDto {
  id: string;
  value: number;
  billingFrequency: number;
  billingDays: number;
  startDate: Date;
  status: string;
  statusDate: Date;
  cancelDate: Date;
  nextCycle: Date;

  constructor(raw: RawSubscriberType) {
    this.id = raw['ID assinante'];
    this.value = Number(
      Number(raw.valor.replace(',', '.')).toFixed(2).replace(/\D/g, ''),
    );
    this.billingFrequency = Number(raw['quantidade cobranças']);
    this.billingDays = Number(raw['cobrada a cada X dias']);
    this.startDate = new Date(raw['data início']);
    this.status = raw.status;
    this.statusDate = new Date(raw['data status']);
    this.cancelDate = new Date(raw['data cancelamento']);
    this.nextCycle = new Date(raw['próximo ciclo']);
  }
}
