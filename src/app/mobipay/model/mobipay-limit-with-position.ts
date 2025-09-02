export class MobipayLimitWithPosition {
  position: number;
  partnerCode: string;
  limit: number;


  constructor(position: number, partnerCode: string, limit: number) {
    this.position = position;
    this.partnerCode = partnerCode;
    this.limit = limit;
  }
}
