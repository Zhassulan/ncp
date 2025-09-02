import {Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'paymentDetailsPipe' })
export class PaymentDetailsPipe implements PipeTransform {
    transform(paymentDetails: string): string {
        return paymentDetails.replace(/.,/g, ', ');
    }
}
