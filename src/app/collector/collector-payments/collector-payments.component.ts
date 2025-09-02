import {Component, inject, ViewChild} from '@angular/core';
import {DateRangeComponent} from '../../date-range/date-range.component';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatTooltip} from '@angular/material/tooltip';
import {PaymentsTableComponent} from '../../payments/payments-table/payments-table-component';
import {QuickSearchService} from '../../service/quick-search.service';
import {PaymentsService, PaymentsType} from '../../payments/payments.service';

@Component({
  selector: 'app-collector-payments',
  imports: [
    DateRangeComponent,
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatTooltip,
    PaymentsTableComponent
  ],
  templateUrl: './collector-payments.component.html',
  styleUrl: './collector-payments.component.scss'
})
export class CollectorPaymentsComponent {

  searchInput;

  @ViewChild(DateRangeComponent)
  dateRangeComponent: DateRangeComponent;

  @ViewChild(PaymentsTableComponent)
  private paymentsTableComponent: PaymentsTableComponent;

  private quicksearchService = inject(QuickSearchService);
  private paymentsService = inject(PaymentsService);

  constructor() {
    this.paymentsService.paymentsType = PaymentsType.COLLEECTOR;
  }

  loadData() {
    this.paymentsService.paymentsType = PaymentsType.COLLEECTOR;
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
