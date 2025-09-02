export class MobipayLimit {
  partnerCode: string;
  limit: number;

  constructor(partnerCode: string, limit: number) {
    this.partnerCode = partnerCode;
    this.limit = limit;
  }
}
