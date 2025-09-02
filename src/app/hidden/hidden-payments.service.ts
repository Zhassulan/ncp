import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PageableApiResponse} from '../payments/model/pageable-api-response';
import {httpHeaders} from '../settings';

const API_URL = environment.API_URL;

@Injectable({providedIn: 'any'})
export class HiddenPaymentsService {

  constructor(private http: HttpClient) {
  }

  hide(id, user): Observable<PageableApiResponse> {
    const httpParams = new HttpParams().set('id', id);
    return this.http.put<PageableApiResponse>(`${API_URL}/hidden`, null, {params: httpParams, headers: httpHeaders});
  }

  unhide(id, user): Observable<PageableApiResponse> {
    const httpParams = new HttpParams().set('id', id);
    return this.http.delete<PageableApiResponse>(`${API_URL}/hidden`, {params: httpParams, headers: httpHeaders});
  }
}
