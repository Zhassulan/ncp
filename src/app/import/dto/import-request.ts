export class ImportRequest {

  private _startDate: number;
  private _endDate: number;

  constructor(startDate: number, endDate: number) {
    this._startDate = startDate;
    this._endDate = endDate;
  }

  get startDate(): number {
    return this._startDate;
  }

  get endDate(): number {
    return this._endDate;
  }
}
