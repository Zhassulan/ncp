export class PaymentRegistryItemRequest {

  msisdn: string;
  account: number;
  sum: number;
  icc: string;
  nomenclature: string;

  constructor(msisdn: string, account: number, sum: number, icc: string, nomenclature: string) {
    this.msisdn = msisdn;
    this.account = account;
    this.sum = sum;
    this.icc = icc;
    this.nomenclature = nomenclature;
  }
}
