import {Component, effect, inject, model, ViewChild} from '@angular/core';

import {MatPaginator} from '@angular/material/paginator';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {PaymentService} from '../payment.service';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {PaymentRegistryItem} from '../model/paymentRegistryItem';
import {PaymentStatus} from '../../settings';
import {RouterService} from '../../router/router.service';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {PhonePipe} from '../phone-pipe';
import {CurrencyPipe, NgIf} from '@angular/common';
import {Payment} from '../model/payment';
import {PaymentStatusPipePipe} from '../../payments/payment-status-ru-pipe';

const PaymentDetailsTableColumns = [
  'num',
  'nomenclature',
  'msisdn',
  'icc',
  'account',
  'sum',
  'status',
  'del'
];

enum PaymentDetailTableColumnsDisplay {
  num = '#',
  nomenclature = 'Номенклатура',
  msisdn = 'Номер',
  icc = 'ICC',
  account = 'Лицевой счёт',
  sum = 'Сумма',
  status = 'Статус',
  del = 'Удалить'
}

@Component({
  selector: 'app-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss'],
  imports: [MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatSortHeader,
    MatMiniFabButton, MatIcon, MatTooltip, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator, PhonePipe,
    CurrencyPipe, NgIf, PaymentStatusPipePipe]
})
export class PaymentDetailsComponent {

  paymentStatus = PaymentStatus;
  dataSource = new MatTableDataSource<PaymentRegistryItem>();
  displayedColumns: string[] = PaymentDetailsTableColumns;
  detailTableColumnsDisplay = PaymentDetailTableColumnsDisplay;
  @ViewChild(MatPaginator, {static: true}) public paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) public sort: MatSort;
  readonly paymentService = inject(PaymentService);
  readonly routerService = inject(RouterService);
  payment = model<Payment>();

  constructor() {
    effect(() => {
      if (this.payment()) {
        console.log('Details component: payment updated..');
        console.log(this.payment());
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.data = this.payment().registry;
      }
    });
  }

  del(row) {
    this.payment.update(p => {
      p.registry.splice(p.registry.indexOf(row), 1);
      return {...p, value: p};
    });
  }

  delAll() {
    this.payment.update(p => {
      p.registry = [];
      return {...p, value: p};
    });

    this.routerService.resetFilePayment();
  }

  canDeleteRegistryItem(item) {
    return this.paymentService.canDeleteRegistryItem(this.payment(), item);
  }

  canDeleteRegistry() {
    return this.paymentService.canDeleteRegistry(this.payment());
  }

  sum() {
    if (this.payment()) {

      return this.payment().registry.length > 0 ? this.paymentService.getRegistrySum(this.payment()) : 0;
    }

    return 0;
  }
}
