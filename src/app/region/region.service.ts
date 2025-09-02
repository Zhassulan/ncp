import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {httpHeaders} from '../settings';
import {environment} from '../../environments/environment';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'any'
})
export class RegionService {

  constructor(private http: HttpClient) {
  }

  findAll() {
    return this.http.get<any>(`${API_URL}/regions`, {headers: httpHeaders});
  }
}
