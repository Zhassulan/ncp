import {Component} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateRangeService} from './date-range.service';
import {DateRangeMills} from '../payments/model/date-range-mills';
import {MatInputModule, MatSuffix} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
  imports: [MatDatepickerModule, FormsModule, ReactiveFormsModule, MatSuffix, MatFormFieldModule, MatInputModule,
    MatNativeDateModule]
})
export class DateRangeComponent {

  datePickerStart = new FormControl(new Date());
  datePickerEnd = new FormControl(new Date());

  constructor(private dateRangeService: DateRangeService) {
    this.dateRangeService.setStartDateAnnounced$.subscribe(start =>
      this.datePickerStart.setValue(new Date(start)));
    this.dateRangeService.setEndDateAnnounced$.subscribe(end =>
      this.datePickerEnd.setValue(new Date(end)));
  }

  startDateChanged() {
    this.setTime();
    this.dateRangeService.announceDateRange(new DateRangeMills(this.datePickerStart.value,
      this.datePickerEnd.value));
  }

  endDateChanged() {
    this.setTime();
    this.dateRangeService.announceDateRange(new DateRangeMills(this.datePickerStart.value,
      this.datePickerEnd.value));
  }

  public setTime() {
    this.setDatePickerStartByMills(this.datePickerStart.value.getTime());
    this.setDatePickerEndByMills(this.datePickerEnd.value.getTime());
  }

  setDatePickerStartByMills(mills) {
    const s = new Date(mills);
    s.setHours(0, 0, 0, 0);
    this.datePickerStart.setValue(s);
  }

  setDatePickerEndByMills(mills) {
    const s = new Date(mills);
    s.setHours(23, 59, 59, 999);
    this.datePickerEnd.setValue(s);
  }
}
