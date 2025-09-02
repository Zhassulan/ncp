import {Equipment} from './equipment';

export class PaymentRegistryItem {
  id: number;
  paymentId: number;
  msisdn: string;
  account: number;
  sum: number;
  status: number;
  error: string;
  distributed: string;
  user: string;
  equipment: Equipment;
}
