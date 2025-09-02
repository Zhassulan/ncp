import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PageableApiResponse} from '../payments/model/pageable-api-response';
import { HttpClient } from '@angular/common/http';
import {httpHeaders} from '../settings';
import {environment} from '../../environments/environment';
import {GetPaymentsRequestPageable} from '../api-dto/get-payments-request-pageable';

const API_URL = environment.API_URL;

@Injectable({providedIn: 'any'})
export class RawPaymentsService {

  constructor(private http: HttpClient) {
  }

  getPayments(req: GetPaymentsRequestPageable): Observable<PageableApiResponse> {
    return this.http.post<PageableApiResponse>(`${API_URL}/raw-payments`,
      req,
      {headers: httpHeaders});
  }
}
