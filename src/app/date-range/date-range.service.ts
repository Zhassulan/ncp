import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {DateRangeMills} from '../payments/model/date-range-mills';

@Injectable({
  providedIn: 'any'
})
export class DateRangeService {

  private dateRangeAnnounced = new Subject<DateRangeMills>();
  dateRangeAnnounced$ = this.dateRangeAnnounced.asObservable();

  private startDateAnnounced = new Subject<number>();
  setStartDateAnnounced$ = this.startDateAnnounced.asObservable();

  private endDateAnnounced = new Subject<number>();
  setEndDateAnnounced$ = this.endDateAnnounced.asObservable();

  private _dateRange: DateRangeMills = new DateRangeMills(new Date(), new Date());

  constructor() {
    this.roundTime();
  }

  announceDateRange(value) {
    this._dateRange = value;
    this.dateRangeAnnounced.next(value);
  }

  announceStartDate(value) {
    this._dateRange.startDate = value;
    this.startDateAnnounced.next(value);
  }

  announceEndDate(value) {
    this._dateRange.endDate = value;
    this.endDateAnnounced.next(value);
  }

  get dateRange(): DateRangeMills {
    return this._dateRange;
  }

  isInvalidLoadDataRequest(): boolean {
    return (!this.dateRange || (!this.dateRange.startDate || false) ||
      (!this.dateRange.endDate || false));
  }

  public roundTime() {
    const from = new Date(this._dateRange.startDate);
    const to = new Date(this._dateRange.endDate);
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);
    this._dateRange.startDate = from;
    this._dateRange.endDate = to;
  }
}
