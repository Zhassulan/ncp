import {Component, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {Payment} from '../../payment/model/payment';
import {DateRangeComponent} from '../../date-range/date-range.component';
import {PaymentsTableComponent} from '../../payments/payments-table/payments-table-component';
import {PaymentsService, PaymentsType} from '../../payments/payments.service';
import {QuickSearchService} from '../../service/quick-search.service';
import {MatButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatFormField, MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-hidden-payments',
  templateUrl: './hidden-payments.component.html',
  styleUrl: './hidden-payments.component.scss',
  imports: [DateRangeComponent, MatButton, MatTooltip, MatFormField, MatInput, FormsModule, PaymentsTableComponent,
    MatIconModule]
})
export class HiddenPaymentsComponent {

  searchInput;
  selection = new SelectionModel<Payment>(true, []);

  @ViewChild(DateRangeComponent)
  dateRangeComponent: DateRangeComponent;

  @ViewChild(PaymentsTableComponent)
  private paymentsTableComponent: PaymentsTableComponent;

  constructor(private paymentsService: PaymentsService,
              private quicksearchService: QuickSearchService) {

    this.paymentsService.paymentsType = PaymentsType.HIDDEN;
  }

  loadData() {
    this.paymentsService.paymentsType = PaymentsType.HIDDEN;
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
