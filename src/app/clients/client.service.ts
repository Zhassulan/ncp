import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {httpHeaders} from '../settings';
import {ClientProps} from '../payment/model/client-props';
import {GetClientRequest} from './get-client-request';
import {GetDataPageableResponse} from './dto/get-data-pageable-response';
import {ClientProfileDto} from './model/clientProfileDto';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'any'
})
export class ClientService {

  private _client: ClientProfileDto;

  constructor(private http: HttpClient) {
  }

  get client() {
    return this._client;
  }

  set client(value) {
    this._client = value;
  }

  getClientProfileById(id) {
    return this.http.get<ClientProfileDto>(`${API_URL}/profiles/${id}`);
  }

  getClients(req: GetClientRequest): Observable<GetDataPageableResponse> {
    return this.http.post<GetDataPageableResponse>(`${API_URL}/profiles`, req, {headers: httpHeaders});
  }

  isMobipay(id: number) {
    return this.http.get<boolean>(`${API_URL}/profiles/${id}/is-mobipay`, {headers: httpHeaders});
  }

  findAllContractsByIdPageable(id, pageSize, page) {
    const params = new HttpParams()
      .set('page-size', pageSize)
      .set('page', page);
    return this.http.get<any>(`${API_URL}/clients/${id}/contracts/pageable`, {params: params, headers: httpHeaders});
  }

  getTotalContractsNumber(profileId) {
    return this.http.get<number>(`${API_URL}/clients/${profileId}/contracts/total`, {headers: httpHeaders});
  }

  deleteContract(contractId, profileId) {
    return this.http.delete<void>(`${API_URL}/clients/${profileId}/contracts/${contractId}`, {headers: httpHeaders});
  }

  updateProfile(profile) {
    return this.http.put<void>(`${API_URL}/clients`, profile, {headers: httpHeaders});
  }

  getClientType(clntId) {
    return this.http.get<any>(`${API_URL}/clients/${clntId}/type`, {headers: httpHeaders});
  }

  getContractCount(profileId, contract) {
    return this.http.post<any>(`${API_URL}/clients/${profileId}/contract/count`, contract, {headers: httpHeaders});
  }

  getClientProps(bin, profileId) {
    const params = new HttpParams().set('profileId', profileId);
    return this.http.get<ClientProps>(`${API_URL}/clients/${bin}/props`, {params: params, headers: httpHeaders});
  }
}
