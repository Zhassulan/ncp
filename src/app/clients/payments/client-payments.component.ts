import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {DateRangeComponent} from '../../date-range/date-range.component';
import {PaymentsService, PaymentsType} from '../../payments/payments.service';
import {PaymentsTableComponent} from '../../payments/payments-table/payments-table-component';
import {QuickSearchService} from '../../service/quick-search.service';
import {ClientService} from '../client.service';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatFormField, MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-payments',
  templateUrl: './client-payments.component.html',
  styleUrls: ['./client-payments.component.scss'],
  imports: [MatCard, MatCardContent, DateRangeComponent, MatButton, MatTooltip, MatFormField, MatInput, FormsModule,
    PaymentsTableComponent]
})
export class ClientPaymentsComponent implements AfterViewInit {

  searchInput;
  clientName;

  @ViewChild(DateRangeComponent)
  dateRange: DateRangeComponent;

  @ViewChild(PaymentsTableComponent)
  private paymentsTableComponent: PaymentsTableComponent;

  paymentsService = inject(PaymentsService);
  readonly quicksearchService = inject(QuickSearchService);
  readonly clientService = inject(ClientService);
  readonly route = inject(ActivatedRoute);
  readonly snackbar = inject(MatSnackBar);

  constructor() {
    this.paymentsService.paymentsType = PaymentsType.CLIENTS;
  }

  ngAfterViewInit(): void {
    const id = this.getProfileIdFromUrl();

    /*const $getClientProfile = this.clientService.getClientProfileById(id);
    const $isMobipay = this.clientService.isMobipay(id);

    forkJoin([$getClientProfile, $isMobipay]).subscribe(([profile, isMobipay]) => {
      this.clientName = '"' + profile.client + '", ' + profile.bin + (isMobipay ? ' (Mobipay)' : '');
    });*/

    this.clientService.getClientProfileById(id).subscribe({
      next: data => this.clientName = '"' + data.client + '", ' + data.bin + (data.mobipay ? ' (Mobipay)' : ''),
      error: error => {
        console.log(error);
        this.snackbar.open(`Ошибка загрузки профиля клиента ${error.error.message}`, 'OK');
      }
    });
  }

  getProfileIdFromUrl() {
    return this.route.snapshot.params['id'];
  }

  loadData() {
    this.paymentsService.paymentsType = PaymentsType.CLIENTS;
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
      this.quicksearchService.announce(this.searchInput);
    }
  }
}
