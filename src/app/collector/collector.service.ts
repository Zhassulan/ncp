import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {httpHeaders} from '../settings';
import {GetDataPageableResponse} from '../clients/dto/get-data-pageable-response';
import {PageableApiResponse} from '../payments/model/pageable-api-response';
import {GetPaymentsRequestPageable} from '../api-dto/get-payments-request-pageable';
import {Observable} from 'rxjs';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class CollectorService {

  readonly http = inject(HttpClient);

  findAll(pageIndex: number, pageSize: number) {
    const params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize);

    return this.http.get<GetDataPageableResponse>(`${API_URL}/collectors`, {params: params, headers: httpHeaders});
  }

  delete(id: number) {
    return this.http.delete(`${API_URL}/collectors/${id}`, {headers: httpHeaders});
  }

  add(id: number, branch: string) {
    const params = new HttpParams()
      .set('id', id)
      .set('branch', branch);
    return this.http.post<any>(`${API_URL}/collectors`, null, {params: params, headers: httpHeaders});
  }

  getPayments(req: GetPaymentsRequestPageable): Observable<PageableApiResponse> {
    return this.http.post<PageableApiResponse>(`${API_URL}/payments/collector`, req, {headers: httpHeaders});
  }
}
