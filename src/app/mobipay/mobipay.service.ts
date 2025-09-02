import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {MobipayLimitsUpdateResponse} from './model/mobipay-limits-update-response';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {httpHeaders} from '../settings';
import {Payment} from '../payment/model/payment';
import {ChangeMobipayResponse} from './model/change-mobipay-response';
import {AuthService} from '../auth/auth.service';
import {Partner} from './model/partner';
import {MobipayLimit} from './model/mobipay-limit';

const API_URL = environment.API_URL;

@Injectable({providedIn: 'root'})
export class MobipayService {

  mobipayLimitsUpdateResponses: MobipayLimitsUpdateResponse [];

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  uploadLimits(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const params = new HttpParams()
      .set('user', this.authService.getUser());
    return this.http.post<MobipayLimit []>(`${API_URL}/mobipay/limits/upload`, formData, {params: params});
  }

  getPartners(paymentId) {
    const params = new HttpParams()
      .set('paymentId', paymentId);
    return this.http.get<Partner []>(`${API_URL}/mobipay/partners`, {params: params, headers: httpHeaders});
  }

  change(id): Observable<ChangeMobipayResponse> {
    const params = new HttpParams()
      .set('user', this.authService.getUser());
    return this.http.post<ChangeMobipayResponse>(`${API_URL}/mobipay/change/${id}`, null, {
      params: params,
      headers: httpHeaders
    });
  }

  /**
   *
   * @param id
   * @param cancel - if true - delate payment from billing, false - create payment in billing
   * @param partnerCode
   */
  distribute(id, cancel, partnerCode) {
    const params = new HttpParams()
      .set('cancel', cancel)
      .set('partnerCode', partnerCode);
    return this.http.post<Payment>(`${API_URL}/mobipay/distribute/${id}`, null, {params: params, headers: httpHeaders});
  }

  applyLimits(limits: MobipayLimit []) {
    return this.http.post<MobipayLimitsUpdateResponse []>(`${API_URL}/mobipay/limits/apply`, limits, {headers: httpHeaders});
  }
}
