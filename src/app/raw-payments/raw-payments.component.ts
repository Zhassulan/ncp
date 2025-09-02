import {Component, ViewChild} from '@angular/core';
import {DateRangeComponent} from '../date-range/date-range.component';
import {SelectionModel} from '@angular/cdk/collections';
import {Payment} from '../payment/model/payment';
import {PaymentsTableComponent} from '../payments/payments-table/payments-table-component';
import {PaymentsService, PaymentsType} from '../payments/payments.service';
import {QuickSearchService} from '../service/quick-search.service';
import {MatButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatFormField, MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-raw',
    templateUrl: './raw-payments.component.html',
    styleUrls: ['./raw-payments.component.scss'],
  imports: [DateRangeComponent, MatButton, MatTooltip, MatFormField, MatInput, FormsModule, PaymentsTableComponent]
})
export class RawPaymentsComponent {

  searchInput;
  selection = new SelectionModel<Payment>(true, []);

  @ViewChild(DateRangeComponent, {static: true})
  dateRangeComponent: DateRangeComponent;

  @ViewChild(PaymentsTableComponent)
  private paymentsTableComponent: PaymentsTableComponent;

  constructor(private paymentsService: PaymentsService,
              private quicksearchService: QuickSearchService) {

    this.paymentsService.paymentsType = PaymentsType.RAW;
  }

  loadData() {
    this.paymentsService.paymentsType = PaymentsType.RAW;
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
