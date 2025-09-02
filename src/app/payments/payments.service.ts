import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {httpHeaders} from '../settings';
import {Observable} from 'rxjs';
import {DateRangeMills} from './model/date-range-mills';
import {ImportRequest} from '../import/dto/import-request';
import {ImportResponse} from '../import/dto/import-response';
import {GetPaymentsRequestPageable} from '../api-dto/get-payments-request-pageable';
import {GetDataPageableResponse} from '../clients/dto/get-data-pageable-response';
import {PageableApiResponse} from './model/pageable-api-response';

const API_URL = environment.API_URL;

export enum PaymentsType {
  GENERAL,
  AUTO,
  RAW,
  DEFERRED,
  CLIENTS,
  MOBIPAY,
  HIDDEN,
  B2B,
  COLLEECTOR
}

@Injectable({providedIn: 'any'})
export class PaymentsService {

  paymentsType: PaymentsType;

  constructor(private http: HttpClient) {
    console.log('Payment service init..');
  }

  getPayments(req: GetPaymentsRequestPageable) {
    return this.http.post<GetDataPageableResponse>(`${API_URL}/payments`, req, {headers: httpHeaders});
  }

  export(dateRange: DateRangeMills) {
    const httpParams = new HttpParams()
      .set('from', dateRange.startDate.getTime())
      .set('to', dateRange.endDate.getTime());
    return this.http.get(`${API_URL}/payments/export`, {params: httpParams, headers: httpHeaders});
  }

  import(request: ImportRequest): Observable<ImportResponse> {
    const httpParams = new HttpParams()
      .set('from', request.startDate)
      .set('to', request.endDate);
    return this.http.get<ImportResponse>(`${API_URL}/payments/import-bank-data`, {
      params: httpParams,
      headers: httpHeaders
    });
  }

  getMinDateByProfileId(id) {
    const httpParams = new HttpParams()
      .set('profile-id', id);
    return this.http.get(`${API_URL}/payments/min-date`, {params: httpParams, headers: httpHeaders});
  }

  getMaxDateByProfileId(id) {
    const httpParams = new HttpParams()
      .set('profile-id', id);
    return this.http.get(`${API_URL}/payments/max-date`, {params: httpParams, headers: httpHeaders});
  }

  getHiddenPayments(req: GetPaymentsRequestPageable): Observable<PageableApiResponse> {
    return this.http.post<PageableApiResponse>(`${API_URL}/payments/hidden`, req, {headers: httpHeaders});
  }

  getAutoPayments(req: GetPaymentsRequestPageable): Observable<PageableApiResponse> {
    return this.http.post<PageableApiResponse>(`${API_URL}/payments/auto`, req, {headers: httpHeaders});
  }
}
