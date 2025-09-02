import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {GetPaymentsRequestPageable} from '../api-dto/get-payments-request-pageable';
import {Observable} from 'rxjs';
import {PageableApiResponse} from '../payments/model/pageable-api-response';
import {httpHeaders} from '../settings';
import {environment} from '../../environments/environment';

const API_URL = environment.API_URL;

@Injectable({providedIn: 'any'})
export class DeferredPaymentService {

  constructor(private httpClient: HttpClient) {
  }

  getPayments(req: GetPaymentsRequestPageable): Observable<PageableApiResponse> {
    return this.httpClient.post<PageableApiResponse>(`${API_URL}/deferred/payments`, req, {headers: httpHeaders});
  }
}
