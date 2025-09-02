import {Component, effect, model} from '@angular/core';
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
import {PaymentStatusPipePipe} from '../../../payments/payment-status-ru-pipe';
import {ActionPipe} from '../action-pipe';
import {DatePipe} from '@angular/common';
import {Action} from '../action';
import {Payment} from '../../model/payment';

@Component({
  selector: 'app-payment-actions',
  templateUrl: './payment-actions.component.html',
  styleUrls: ['./payment-actions.component.scss'],
  imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell,
    MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, PaymentStatusPipePipe, ActionPipe, DatePipe]
})
export class PaymentActionsComponent {

  displayedColumns: string[] = ['status',
    'user',
    'action',
    'description',
    'created'];

  dataSource: MatTableDataSource<Action> = new MatTableDataSource();
  actions: Action[] = [];
  payment = model<Payment>();

  constructor() {
    effect(() => {
      if (this.payment()) {
        console.log('Payment actions component: payment updated..');
        console.log(this.payment());
        this.mergePaymentActions();
      }
    });
  }

  mergePaymentActions() {
    this.payment().paymentActions.forEach(action => {
      this.actions.push(new Action(action.status, action.user, action.description, action.action, action.created));
      this.dataSource.data = this.actions;
    });

    this.payment().transitActions.forEach(action => {
      this.actions.push(new Action(action.status, action.user, '', 'транзитная операция', action.created));
      this.dataSource.data = this.actions;
    });
  }
}
