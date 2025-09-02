import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {httpHeaders} from '../../settings';
import {FindContractRequest} from './dto/find-contract-request';
import {AddContractParams} from './dto/add-contract-params';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'any'
})
export class ContractsService {

  constructor(private http: HttpClient) {
  }

  findContractsPageable(findContractRequest: FindContractRequest, pageSize, page) {
    const params = new HttpParams()
      .set('page-size', pageSize)
      .set('page', page);

    return this.http.post<any>(`${API_URL}/contracts/find`, findContractRequest, {
      params: params,
      headers: httpHeaders
    });
  }

  addContract(body: AddContractParams) {
    return this.http.post<void>(`${API_URL}/clients/contracts`, body, {headers: httpHeaders});
  }
}
