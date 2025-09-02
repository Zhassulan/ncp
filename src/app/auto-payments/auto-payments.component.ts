import {Component, ViewChild} from '@angular/core';
import {DateRangeComponent} from '../date-range/date-range.component';
import {PaymentsTableComponent} from '../payments/payments-table/payments-table-component';
import {QuickSearchService} from '../service/quick-search.service';
import {PaymentsService, PaymentsType} from '../payments/payments.service';
import {MatButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatFormField, MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-auto-payments',
  templateUrl: './auto-payments.component.html',
  styleUrls: ['./auto-payments.component.scss'],
  imports: [DateRangeComponent, MatButton, MatTooltip, MatFormField, MatInput, FormsModule, PaymentsTableComponent]
})
export class AutoPaymentsComponent {

  searchInput;

  @ViewChild(DateRangeComponent)
  dateRangeComponent: DateRangeComponent;

  @ViewChild(PaymentsTableComponent)
  private paymentsTableComponent: PaymentsTableComponent;

  constructor(private quicksearchService: QuickSearchService,
              private paymentsService: PaymentsService) {

    this.paymentsService.paymentsType = PaymentsType.AUTO;
  }

  loadData() {
    this.paymentsService.paymentsType = PaymentsType.AUTO;
    this.paymentsTableComponent.loadPayments();
  }

  export() {
    this.paymentsTableComponent.export();
  }

  findClick() {
    this.quicksearchService.announce(this.searchInput);
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
      this.loadData();
    }
  }
}
