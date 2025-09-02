import {Component, ViewChild} from '@angular/core';
import {PaymentsTableComponent} from '../../payments/payments-table/payments-table-component';
import {DateRangeComponent} from '../../date-range/date-range.component';
import {QuickSearchService} from '../../service/quick-search.service';
import {PaymentsService, PaymentsType} from '../../payments/payments.service';
import {MatButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatFormField, MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-deferred-payments',
    templateUrl: './deferred-payments.component.html',
    styleUrls: ['./deferred-payments.component.scss'],
  imports: [DateRangeComponent, MatButton, MatTooltip, MatFormField, MatInput, FormsModule, PaymentsTableComponent]
})
export class DeferredPaymentsComponent {

  searchInput;

  @ViewChild(DateRangeComponent, {static: true})
  dateRangeComponent: DateRangeComponent;

  @ViewChild(PaymentsTableComponent)
  private paymentsTableComponent: PaymentsTableComponent;

  constructor(private quicksearchService: QuickSearchService,
              private paymentsService: PaymentsService) {

    this.paymentsService.paymentsType = PaymentsType.DEFERRED;
  }

  loadData() {
    this.paymentsService.paymentsType = PaymentsType.DEFERRED;
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
