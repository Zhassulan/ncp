import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class QuickSearchService {

  private progressObs = new Subject<string>();
  valueAnnounced$ = this.progressObs.asObservable();
  private _value: string;

  constructor() {
    this._value = '';
  }

  announce(value) {
    this._value = value;
    this.progressObs.next(this._value);
  }

  searchParamIsEmpty(): boolean {
    if (this._value === '' || this._value === undefined ) {
      return true;
    }
    return false;
  }

  get value(): string {
    return this._value;
  }
}
