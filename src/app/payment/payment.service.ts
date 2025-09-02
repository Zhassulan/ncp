import {Injectable} from '@angular/core';
import {httpHeaders, PaymentStatus} from '../settings';
import {Payment} from './model/payment';
import {PaymentRegistryItem} from './model/paymentRegistryItem';
import {Template} from '../template/model/template';
import {TemplateService} from '../template/template.service';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Equipment} from './model/equipment';
import {Subject} from 'rxjs';
import {PaymentDistributionRequest} from './model/payment-distribution-request';

const API_URL = environment.API_URL;

@Injectable({providedIn: 'any'})
export class PaymentService {

  private payment_: Payment;
  private paymentObs = new Subject<Payment>();

  public templateId: number;

  constructor(private templateService: TemplateService,
              private http: HttpClient,
              private authService: AuthService,
              private snackbar: MatSnackBar) {
  }

  get details() {
    return this.payment_.registry ? this.payment_.registry : null;
  }

  set payment(data) {

    if (data === null) {

      return;
    }

    this.payment_ = data;

    if (this.templateId) {
      this.templateService.findById(this.templateId).subscribe({
        next: (res) => this.loadRegistryFromTemplate(res),
        error: (err) => {
          console.log(err);
          this.snackbar.open('Ошибка получения шаблона', 'OK');
        }
      });
    }
  }

  get payment() {
    return this.payment_;
  }

  announcePayment() {
    this.paymentObs.next(this.payment_);
  }

  addDetailsFromRouterRegistry(payment, items) {
    const registry: PaymentRegistryItem [] = [];
    for (const item of items.slice(0, items.length)) {
      const equipment = new Equipment();
      equipment.nomenclature = item.nomenclature;
      equipment.icc = item.icc;

      const detail = new PaymentRegistryItem();
      detail.msisdn = item.msisdn;
      detail.account = item.account;
      detail.sum = item.sum;
      detail.status = 0;
      registry.push(detail);
      detail.equipment = equipment;
    }
    payment.registry = registry;
  }

  canPasteRegistryFromBuffer(payment) {
    return payment.status === PaymentStatus.NEW || payment.status === PaymentStatus.TRANSIT ||
      payment.status === PaymentStatus.ERR || payment.status === PaymentStatus.TRANSIT_ERR ||
      payment.status === PaymentStatus.TRANSIT_CANCELLED || payment.mobipay === false;
  }

  canLoadEquipment(payment) {
    return payment.status === PaymentStatus.NEW || payment.status === PaymentStatus.TRANSIT || payment.status === PaymentStatus.ERR ||
      payment.status === PaymentStatus.TRANSIT_ERR || payment.status === PaymentStatus.TRANSIT_CANCELLED;
  }

  canTransit(payment) {
    return payment.status === PaymentStatus.NEW || payment.status === PaymentStatus.TRANSIT_CANCELLED;
  }

  canTransitByPayment(payment) {
    return payment.status === PaymentStatus.NEW ||
      payment.status === PaymentStatus.TRANSIT_CANCELLED;
  }

  canDelTransit(payment) {
    return payment.status === PaymentStatus.TRANSIT;
  }

  canDelTransitByPayment(payment) {
    return payment.status === PaymentStatus.TRANSIT;
  }

  canDefer(payment) {
    return (payment.status === PaymentStatus.NEW || payment.status === PaymentStatus.ERR ||
        payment.status === PaymentStatus.TRANSIT_CANCELLED) &&
      payment.registry.filter(i => i.status === PaymentStatus.NEW).length > 0 &&
      this.getRegistrySum(payment) === payment.sum;
  }

  canLoadPhones(payment) {
    return payment ? payment.status === PaymentStatus.NEW ||
      payment.status === PaymentStatus.ERR ||
      payment.status === PaymentStatus.TRANSIT ||
      payment.status === PaymentStatus.TRANSIT_CANCELLED ||
      payment.status === PaymentStatus.TRANSIT_ERR : false;
  }

  canAddDetail(payment) {
    return payment ? payment.status === PaymentStatus.NEW ||
      payment.status === PaymentStatus.TRANSIT ||
      payment.status === PaymentStatus.ERR ||
      payment.status === PaymentStatus.TRANSIT_CANCELLED ||
      payment.status === PaymentStatus.CANCELLED ||
      payment.status === PaymentStatus.TRANSIT_ERR : false;
  }

  canDistribute(payment) {
    const detailsSum = this.getRegistrySum(payment);
    return (payment.status === PaymentStatus.NEW ||
        payment.status === PaymentStatus.TRANSIT ||
        payment.status === PaymentStatus.ERR ||
        payment.status === PaymentStatus.TRANSIT_CANCELLED ||
        payment.status === PaymentStatus.TRANSIT_ERR ||
        payment.status === PaymentStatus.CANCELLED) &&
      payment.registry.filter(i => i.status === PaymentStatus.NEW).length > 0 &&
      Math.round(detailsSum) === Math.round(payment.sum);
  }

  canDistributeMobipay(payment: Payment) {
    return payment.mobipay && payment.status === PaymentStatus.NEW && this.authService.hasMobipayRole()
      && this.authService.hasEditPaymentRole();
  }

  canDelFromDeferred(payment) {
    return payment.status === PaymentStatus.DEFERRED;
  }

  canDel(payment) {
    return payment ? payment.status === PaymentStatus.DISTRIBUTED || payment.status === PaymentStatus.TRANSIT : false;
  }

  importRegistryData(rawdata) {
    let details: PaymentRegistryItem [] = [];
    const rows = rawdata.split('\n');
    const brokenRows = [];
    if (rows.length) {
      details = [];
    }
    for (const row of rows) {
      if (row === '\n' || row === '' || row.trim() === '' || row.replace('\t', '') === '') {

        continue;
      }
      const parts = row.split('\t');
      if (parts.length === 2) {
        const detail = new PaymentRegistryItem();
        detail.status = PaymentStatus.NEW;
        let b = true;
        let msisdn = this.removeSpaces(parts[0]);
        let sum = this.removeSpaces(parts[1]);

        msisdn = this.removeEol(msisdn);
        sum = this.removeEol(sum);

        this.isMSISDN(msisdn) ? detail.msisdn = msisdn : detail.account = Number(msisdn);

        if (sum.includes(',')) {
          sum = parts[1].replace(',', '.');
        }

        isNaN(Number(sum)) || sum === '' ? b = false : detail.sum = Number(sum);

        if (!b) {
          brokenRows.push(row);
        } else if (detail) {
          details.push(detail);
        }
      } else {
        brokenRows.push(row);
      }
    }

    return {'broken': brokenRows, 'imported': details};
  }

  isMSISDN(value) {
    return /^(8|7|)(707|747|708|700|727|701|702|705|777|756|7172|771)(\d{7}$)/i.test(value);
  }

  getRegistrySum(payment) {
    return payment.registry
      .filter(detail => detail.status !== PaymentStatus.CANCELLED)
      .reduce((total, detail) => total + Number(detail.sum), 0);
  }

  canDeleteRegistryItem(payment: Payment, item: PaymentRegistryItem) {
    return (payment.status === PaymentStatus.NEW ||
        payment.status === PaymentStatus.TRANSIT ||
        payment.status === PaymentStatus.ERR ||
        payment.status === PaymentStatus.TRANSIT_CANCELLED ||
        payment.status === PaymentStatus.TRANSIT_ERR ||
        payment.status === PaymentStatus.CANCELLED) && item.status === PaymentStatus.NEW || item.status === PaymentStatus.ERR ||
      item.status === PaymentStatus.TRANSIT_ERR;
  }

  canDeleteRegistry(payment: Payment) {
    return (payment.status === PaymentStatus.NEW ||
      payment.status === PaymentStatus.TRANSIT ||
      payment.status === PaymentStatus.ERR ||
      payment.status === PaymentStatus.TRANSIT_CANCELLED ||
      payment.status === PaymentStatus.TRANSIT_ERR ||
      payment.status === PaymentStatus.CANCELLED) && payment.registry.filter(d => d.status === PaymentStatus.NEW ||
      d.status === PaymentStatus.ERR || d.status === PaymentStatus.TRANSIT_ERR)
      .length > 0;
  }

  loadRegistryFromTemplate(template: Template) {
    this.payment_.registry = [];
    template.details.forEach(detail => {
      const registryItem = new PaymentRegistryItem();
      registryItem.account = detail.account;
      registryItem.msisdn = detail.msisdn;
      registryItem.sum = detail.sum;
      registryItem.status = PaymentStatus.NEW;
      this.payment_.registry.push(registryItem);
    });
  }

  deleteTransit(id) {
    return this.http.delete<Payment>(`${API_URL}/payments/${id}/transit`, {headers: httpHeaders});
  }

  distribute(req: PaymentDistributionRequest) {
    return this.http.post(`${API_URL}/payments/distribution`, req, {headers: httpHeaders});
  }

  distributeAsync(req: PaymentDistributionRequest) {
    return this.http.post(`${API_URL}/payments/distribution/async`, req, {headers: httpHeaders});
  }

  findById(id: number) {
    return this.http.get<Payment>(`${API_URL}/payments/${id}`, {headers: httpHeaders});
  }

  defer(req: PaymentDistributionRequest, deferDate) {
    const params = new HttpParams().set('dt', deferDate);
    return this.http.post<Payment>(`${API_URL}/payments/${req.id}/defer`, req, {
      params: params,
      headers: httpHeaders
    });
  }

  delete(id) {
    return this.http.delete<Payment>(API_URL + `/payments/${id}`, {headers: httpHeaders});
  }

  moveToTransit(paymentId) {
    return this.http.post(`${API_URL}/payments/${paymentId}/transit`, {}, {headers: httpHeaders});
  }

  cancelDeferredPayment(id) {
    return this.http.delete(`${API_URL}/payments/cancel-deferred/${id}`, {headers: httpHeaders});
  }

  canCancelMobipay(payment) {
    return payment ? payment.status === PaymentStatus.DISTRIBUTED && this.authService.hasMobipayRole() && payment.mobipay : false;
  }

  removeSpaces(s: string) {
    return s.trim()
      .split(' ').join('');
  }

  removeEol(s: string): string {
    return s.replace(new RegExp('\n', 'g'), () => '');
  }

  canExportRegistry(payment) {
    return payment ? payment.status === PaymentStatus.DISTRIBUTED || payment.status === PaymentStatus.TRANSIT_DISTRIBUTED
      : false;
  }
}
