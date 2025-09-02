import {AfterViewInit, Component, model} from '@angular/core';
import {FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {PaymentService} from '../payment.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {msisdnLength, PaymentStatus} from '../../settings';
import {ClientService} from '../../clients/client.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatError, MatFormField, MatInput, MatSuffix} from '@angular/material/input';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {PaymentRegistryItem} from '../model/paymentRegistryItem';
import {Message} from '../../message';
import {Payment} from '../model/payment';

@Component({
  selector: 'app-add-detail',
  templateUrl: './add-detail.component.html',
  styleUrls: ['./add-detail.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, MatFormField, MatInput, MatAutocompleteTrigger, MatAutocomplete, MatOption,
    MatIconButton, MatSuffix, MatIcon, MatError, MatButton, MatTooltip, NgIf, AsyncPipe, NgForOf]
})
export class AddDetailComponent implements AfterViewInit {

  profileId;
  loadedPhones: string[] = [];
  loadedAccounts: string[] = [];
  filteredPhones: Observable<string[]>;
  filteredAccounts: Observable<string[]>;
  frmDetail: UntypedFormGroup = new UntypedFormGroup(
    {
      phoneControl: new UntypedFormControl('',
        [
          Validators.minLength(msisdnLength),
          Validators.maxLength(msisdnLength),
        ]),
      accountControl: new UntypedFormControl('',
        [
          Validators.minLength(1),
        ]),
      sumControl: new UntypedFormControl('',
        [
          Validators.min(1)
        ])
    }
  );

  payment = model<Payment>();

  constructor(private paymentService: PaymentService,
              private clientService: ClientService,
              private snackbar: MatSnackBar) {
  }

  ngAfterViewInit(): void {
    this.profileId = this.payment().profileId;
    this.clientService.getClientProps(this.payment().bin, this.profileId).subscribe({
        next: data => {
          if (data.accounts !== null) {
            this.loadedAccounts = data.accounts.map(String);
          }
          if (data.phones !== null) {
            this.loadedPhones = data.phones;
          }

          this.setupFilters();
          this.setupFiltersAdditional();
        },
        error: err => {
          console.log(err);
          this.snackbar.open('Ошибка загрузки пар счетов и номеров для клиента', 'OK');
        }
      }
    );
  }

  setupFilters() {
    this.filteredAccounts = this.accountControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterAccount(value || '')),
    );
    this.filteredPhones = this.phoneControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPhone(value || '')),
    );
  }

  setupFiltersAdditional() {
    this.filteredPhones = this.phoneControl.valueChanges
      .pipe(startWith(''),
        map(state => state ? this._filterPhone(state) : this.loadedPhones.slice()));
    this.filteredAccounts = this.accountControl.valueChanges
      .pipe(startWith(''),
        map(state => state ? this._filterAccount(state) : this.loadedAccounts.slice()));
  }

  get phoneControl() {
    return this.frmDetail.get('phoneControl');
  }

  get accountControl() {
    return this.frmDetail.get('accountControl');
  }

  get sumControl() {
    return this.frmDetail.get('sumControl');
  }

  addDetail() {
    const detail = new PaymentRegistryItem();
    detail.paymentId = this.payment().id;
    this.phoneControl.value === '' || this.phoneControl.value == null ? detail.msisdn = null : detail.msisdn = this.phoneControl.value;
    this.accountControl.value === '' || this.accountControl.value == null ? detail.account = null :
      detail.account = Number(this.accountControl.value);
    let sum = this.sumControl.value.replace(',', '.');
    sum = sum.trim();
    sum = sum.replace(/[\r\n\t\f\v ]/, '');

    if (isNaN(Number(sum))) {
      this.snackbar.open(Message.WAR.INPUT_NUMBER, 'OK');

      return;
    }

    detail.sum = Number(sum);
    detail.status = PaymentStatus.NEW;
    this.payment.update(p => {
      p.registry.push(detail);
      console.log(`Updating payment ${p}..`);
      return {...p, value: p};
    });
    this.clearFields();
  }

  canAddDetail() {
    return (this.phoneControl.value.length > 0 || this.accountControl.value.length > 0) &&
      this.paymentService.canAddDetail(this.payment()) &&
      Number(this.sumControl.value) > 0;
  }

  clearFields() {
    this.clearAccount();
    this.clearPhone();
    this.clearSum();
  }

  clearPhone() {
    this.phoneControl.setValue('');
  }

  clearAccount() {
    this.accountControl.setValue('');
  }

  clearSum() {
    this.sumControl.setValue('');
  }

  phoneChanged() {
    if (!this.paymentService.canLoadPhones(this.payment()) || this.phoneControl.value.trim().length === 0) {
      return;
    }

    this.clearAccount();
  }

  accountChanged() {
    if (!this.paymentService.canLoadPhones(this.payment()) || this.accountControl.value.trim().length === 0) {
      return;
    }

    this.clearPhone();
  }

  private _filterPhone(value: string): string [] {
    return this.loadedPhones.filter(item => item.includes(value));
  }

  private _filterAccount(value: string): string [] {
    return this.loadedAccounts.filter(item => item.includes(value));
  }
}
