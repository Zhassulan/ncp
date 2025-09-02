import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {webSocket} from 'rxjs/webSocket';
import {PaymentProcessingMessage} from '../payment/model/payment-processing-message';

@Injectable({providedIn: 'any'})
export class WebsocketService {
  private paymentProcessingQueueUrl = environment.WS_SERVER + '/payment-processing-queue';
  private webSocketSubject = webSocket<PaymentProcessingMessage>(this.paymentProcessingQueueUrl);
  public webSocket$ = this.webSocketSubject.asObservable();
}
