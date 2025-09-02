import {Injectable} from '@angular/core';
import {GetPaymentsRequestPageable} from '../api-dto/get-payments-request-pageable';
import {Observable} from 'rxjs';
import {PageableApiResponse} from '../payments/model/pageable-api-response';
import {httpHeaders} from '../settings';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';

const API_URL = environment.API_URL;

@Injectable({providedIn: 'any'})
export class B2bPaymentsService {

  constructor(private http: HttpClient) {
  }

  getPayments(req: GetPaymentsRequestPageable): Observable<PageableApiResponse> {
    return this.http.post<PageableApiResponse>(`${API_URL}/payments/b2b`, req, {headers: httpHeaders});
  }
}
