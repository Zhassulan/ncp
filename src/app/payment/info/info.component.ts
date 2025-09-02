import {Component, input} from '@angular/core';
import {PaymentStatus} from '../../settings';
import {PaymentStatusPipePipe} from '../../payments/payment-status-ru-pipe';
import {CurrencyPipe, DatePipe, NgIf} from '@angular/common';
import {Payment} from '../model/payment';

@Component({
  selector: 'app-payment-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  imports: [PaymentStatusPipePipe, NgIf, DatePipe, CurrencyPipe]
})
export class InfoComponent {
  PaymentStatus = PaymentStatus;
  payment = input<Payment>();
}
