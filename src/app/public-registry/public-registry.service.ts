import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {DateRangeMills} from '../payments/model/date-range-mills';
import {PaginationParams} from '../payments/model/pagination-params';
import {Observable} from 'rxjs';
import {PageableApiResponse} from '../payments/model/pageable-api-response';
import {httpHeaders} from '../settings';
import {catchError} from 'rxjs/operators';
import {HttpErrHandler} from '../http-err-handler';
import {PublicRegistryInDto} from './dto/public-registry-in-dto';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'any'
})
export class PublicRegistryService {

  constructor(private http: HttpClient) {
  }

  findById(id) {
    return this.http.get(`${API_URL}/registries/${id}`, {headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  findAll(bin: string,
          dateRange: DateRangeMills,
          paginationParam: PaginationParams): Observable<PageableApiResponse> {

    let httpParams;
    if (dateRange && !bin) {
      httpParams = new HttpParams()
        .set('after', dateRange.startDate.getTime())
        .set('before', dateRange.endDate.getTime())
        .set('page', paginationParam.page)
        .set('page-size', paginationParam.pageSize)
        .set('sort-col', paginationParam.sortColumn)
        .set('sort-order', paginationParam.sortOrder);
    }
    if (!dateRange && bin) {
      httpParams = new HttpParams()
        .set('bin', bin)
        .set('page', paginationParam.page)
        .set('page-size', paginationParam.pageSize)
        .set('sort-col', paginationParam.sortColumn)
        .set('sort-order', paginationParam.sortOrder);
    }
    if (dateRange && bin) {
      httpParams = new HttpParams()
        .set('bin', bin)
        .set('after', dateRange.startDate.getTime())
        .set('before', dateRange.endDate.getTime())
        .set('page', paginationParam.page)
        .set('page-size', paginationParam.pageSize)
        .set('sort-col', paginationParam.sortColumn)
        .set('sort-order', paginationParam.sortOrder);
    }

    return this.http.get<PageableApiResponse>(`${API_URL}/registries`, {params: httpParams, headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  maxDate(bin: string): Observable<number> {
    let httpParams;
    if (bin) {
      httpParams = new HttpParams()
        .set('bin', bin);
    }
    return this.http.get<number>(`${API_URL}/registries/max-date`, {params: httpParams, headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  minDate(bin: string): Observable<number> {
    let httpParams;
    if (bin) {
      httpParams = new HttpParams()
        .set('bin', bin);
    }
    return this.http.get<number>(`${API_URL}/registries/min-date`, {params: httpParams, headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  export(dateRange: DateRangeMills): Observable<PublicRegistryInDto []> {
    let httpParams;
    if (dateRange) {
      httpParams = new HttpParams()
        .set('from', dateRange.startDate.getTime())
        .set('to', dateRange.endDate.getTime());
    }

    return this.http.get<PublicRegistryInDto []>(`${API_URL}/registries/export`, {params: httpParams, headers: httpHeaders});
  }
}
