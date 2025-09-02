import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {Payment} from '../payment/model/payment';
import {PaymentsTableComponent} from './payments-table/payments-table-component';
import {DateRangeService} from '../date-range/date-range.service';
import {QuickSearchService} from '../service/quick-search.service';
import {DateRangeComponent} from '../date-range/date-range.component';
import {PaymentsService, PaymentsType} from './payments.service';
import {MatButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatFormField, MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {navpath} from '../settings';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  imports: [DateRangeComponent, MatButton, MatTooltip, MatFormField, MatInput, FormsModule, PaymentsTableComponent]
})
export class PaymentsComponent {

  searchInputValue;

  @ViewChild(DateRangeComponent)
  dateRangeComponent: DateRangeComponent;

  @ViewChild(PaymentsTableComponent)
  private paymentsTableComponent: PaymentsTableComponent;

  selection = new SelectionModel<Payment>(true, []);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor(private dateRangeService: DateRangeService,
              private quicksearchService: QuickSearchService,
              private paymentsService: PaymentsService) {

    this.dateRangeService.dateRangeAnnounced$.subscribe(() => {
      this.searchInputValue = '';
    });

    paymentsService.paymentsType = PaymentsType.GENERAL;
  }

  get dataSource() {
    return this.paymentsTableComponent.dataSource;
  }

  export() {
    this.paymentsTableComponent.export();
  }

  loadData() {
    this.quicksearchService.announce(this.searchInputValue.trim());
    this.paymentsService.paymentsType = PaymentsType.GENERAL;
    this.paymentsTableComponent.loadPayments();
  }

  findClick() {
    this.quicksearchService.announce(this.searchInputValue);
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
      this.loadData();
    }
  }
}
