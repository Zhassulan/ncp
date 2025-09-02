import {Pipe, PipeTransform} from '@angular/core';
import {PaymentStatusRu} from '../settings';

@Pipe({ name: 'paymentStatusPipe' })
export class PaymentStatusPipePipe implements PipeTransform {

  transform(status): string {
    return PaymentStatusRu[status];
  }
}
