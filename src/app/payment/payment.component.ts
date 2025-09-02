import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DETAILS_NUMBER_FOR_ASYNC_DISTRIBUTION, PaymentMenuItems, PaymentStatus} from '../settings';
import {PaymentService} from './payment.service';
import {DlgImportRouterRegistryComponent} from './dialog/dlg-import-router-registry.component';
import {ActivatedRoute, Router} from '@angular/router';
import {PaymentDetailsComponent} from './details/payment-details.component';
import {DlgDeferComponent} from './calendar-defer-modal/dlg-defer.component';
import {of, Subscription, switchMap} from 'rxjs';
import {DlgRegistryBufferComponent} from './add-registry-modal/dlg-registry-buffer.component';
import {Message} from '../message';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MobipayService} from '../mobipay/mobipay.service';
import {ExcelService} from '../excel/excel.service';
import {AuthService} from '../auth/auth.service';
import {WebsocketService} from '../websocket/websocket.service';
import {PaymentStatusPipePipe} from '../payments/payment-status-ru-pipe';
import {ConfirmationDlgComponent} from '../mobipay/confirmation/confirmation-dlg/confirmation-dlg.component';
import {DatePipe, DecimalPipe, NgIf} from '@angular/common';
import {Partner} from '../mobipay/model/partner';
import {Payment} from './model/payment';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {PaymentMenuComponent} from './menu/payment-menu.component';
import {InfoComponent} from './info/info.component';
import {AddDetailComponent} from './add-detail/add-detail.component';
import {PaymentActionsComponent} from './actions/payment-actions/payment-actions.component';
import {SpinnerService} from '../spinner/spinner.service';
import {PaymentDistributionRequest} from './model/payment-distribution-request';
import {PaymentRegistryItemRequest} from './model/payment-registry-item-request';
import {DlgMobipayPartnersComponent} from '../mobipay/partners/dlg-mobipay-partners.component';

export interface RegistryDialogData {
  registry: string;
}

export interface CalendarDialogData {
  date: string;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  imports: [MatTabGroup, MatTab, PaymentMenuComponent, InfoComponent, AddDetailComponent, PaymentDetailsComponent,
    PaymentActionsComponent, NgIf, DatePipe]
})
export class PaymentComponent implements OnInit, OnDestroy {

  private paymentMenuItems = PaymentMenuItems;
  private registry: string;
  private deferDate = new Date();
  private subscription: Subscription;
  private pipe = new PaymentStatusPipePipe();
  readonly spinnerService = inject(SpinnerService);
  payment = signal<Payment>(undefined);
  readonly dlg = inject(MatDialog);
  dialogRef;

  constructor(public paymentService: PaymentService,
              private route: ActivatedRoute,
              private router: Router,
              private snackbar: MatSnackBar,
              private mobipayService: MobipayService,
              private excelService: ExcelService,
              private authService: AuthService,
              private webSocketService: WebsocketService,
              private decimalPipe: DecimalPipe) {
  }

  ngOnInit() {
    console.log('Loading payment ID ' + this.route.snapshot.params['id']);
    this.loadPayment(this.route.snapshot.params['id']);

    this.webSocketService.webSocket$.subscribe({
      next: value => {
        if (value.user === this.authService.getUser()) {
          if (value.status === PaymentStatus.ERR || value.status === PaymentStatus.TRANSIT_ERR) {
            const ref = this.snackbar.open(value.nameSender.concat(' ', value.rnnSender, ' статус платежа ID ', value.paymentId.toString(),
              '"', this.pipe.transform(value.status), '"', value.message === null ? '' : value.message), 'OK');
            ref.afterDismissed().subscribe(() => {
              this.reloadPage();
            });
          } else {
            this.reloadPage();
          }
        }
      },
      error: err => {
        console.log(err);
        this.snackbar.open('Ошибка при обработке Websocket сообщения', 'OK');
      },
      complete: () => {
      }
    });
  }

  public menuOnSelected(selectedMenuItem: number) {
    switch (selectedMenuItem) {
      case this.paymentMenuItems.LOAD_EQUIPMENT: {
        this.importEquipmentDlg();
        break;
      }
      case this.paymentMenuItems.DISTRIBUTE: {
        this.distributePayment();
        break;
      }
      case this.paymentMenuItems.REGISTRY: {
        this.importRegistryDlg();
        break;
      }
      case this.paymentMenuItems.DEFER: {
        this.deferPaymentDlg();
        break;
      }
      case this.paymentMenuItems.DEL_TRANSIT: {
        this.deleteTransitPayment();
        break;
      }
      case this.paymentMenuItems.TRANSIT: {
        this.moveToTransit();
        break;
      }
      case this.paymentMenuItems.DEL: {
        this.deletePayment();
        break;
      }
      case this.paymentMenuItems.TEMPLATE: {
        this.openTemplates();
        break;
      }
      case this.paymentMenuItems.CANCEL_DEFERRED: {
        this.cancelDeferred();
        break;
      }
      case this.paymentMenuItems.CANCEL_MOBIPAY: {
        this.cancelMobipay();
        break;
      }
      case this.paymentMenuItems.DISTRIBUTE_MOBIPAY: {
        this.distributeMobipayDialog();
        break;
      }
      case this.paymentMenuItems.DOWNLOAD_REGISTRY: {
        this.downloadRegistry();
        break;
      }
      default:
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private loadPayment(id) {
    this.spinnerService.start();
    return this.paymentService.findById(id).subscribe({
      next: value => {
        this.payment.set(value);
      },
      error: err => {
        this.snackbar.open('Ошибка загрузки платежа. ' + (err.error.message === undefined ? 'Сервис не отвечает' :
          err.error.message), 'OK');
        this.spinnerService.stop();
      },
      complete: () => this.spinnerService.stop()
    });
  }

  private importEquipmentDlg() {
    const dlgRef = this.dlg.open(DlgImportRouterRegistryComponent, {
      width: '40%',
      height: '30%',
      disableClose: true,
      data: {payment: this.payment()},
    });
    dlgRef.afterClosed().subscribe(payment => {
      this.payment.update(p => {
        return {...p, value: payment};
      });
    });
  }

  private distributePayment() {
    this.distributePaymentSync();
    if (this.payment().registry.length >= DETAILS_NUMBER_FOR_ASYNC_DISTRIBUTION) {
      this.distributePaymentAsync();
    } else {
      this.distributePaymentSync();
    }
  }

  private distributePaymentSync() {
    this.spinnerService.start();
    const registry: PaymentRegistryItemRequest [] = [];
    this.payment().registry
      .filter(r => r.status === PaymentStatus.NEW)
      .forEach(r => {
        registry.push(new PaymentRegistryItemRequest(r.msisdn, r.account, r.sum, null, null));
      });
    const req = new PaymentDistributionRequest(this.payment().id, registry);
    this.paymentService.distribute(req).subscribe({
      error: error => {
        console.log(error);
        this.spinnerService.stop();
        const ref = this.snackbar.open(error.error.message, 'OK');
        ref.afterDismissed().subscribe(() => {
          this.reloadPage();
        });
      },
      complete: () => {
        this.spinnerService.stop();
        const ref = this.snackbar.open('Операция разноски окончена', 'OK');
        ref.afterDismissed().subscribe(() => {
          this.reloadPage();
        });
      }
    });
  }

  private distributePaymentAsync() {
   /* const registry: PaymentRegistryItemRequest [] = [];
    this.payment().registry
      .filter(r => r.status === PaymentStatus.NEW)
      .forEach(r => {
        registry.push(new PaymentRegistryItemRequest(r.msisdn, r.account, r.sum, null, null));
      });
    const req = new PaymentDistributionRequest(this.payment().id, registry);
    this.paymentService.distributeAsync(req).subscribe({complete: () => this.snackbar.open('Платеж в обработке', 'OK')});*/

    this.spinnerService.start();
    const registry: PaymentRegistryItemRequest [] = [];
    this.payment().registry
      .filter(r => r.status === PaymentStatus.NEW)
      .forEach(r => {
        registry.push(new PaymentRegistryItemRequest(r.msisdn, r.account, r.sum, null, null));
      });
    const req = new PaymentDistributionRequest(this.payment().id, registry);
    this.paymentService.distribute(req).subscribe({
      error: error => {
        console.log(error);
        this.spinnerService.stop();
        const ref = this.snackbar.open(error.error.message, 'OK');
        ref.afterDismissed().subscribe(() => {
          this.reloadPage();
        });
      },
      complete: () => {
        this.spinnerService.stop();
        const ref = this.snackbar.open('Операция разноски окончена', 'OK');
        ref.afterDismissed().subscribe(() => {
          this.reloadPage();
        });
      }
    });
  }

  private deleteTransitPayment() {
    this.spinnerService.start();
    this.subscription = this.paymentService.deleteTransit(this.payment().id).subscribe({
      error: err => {
        this.spinnerService.stop();
        this.snackbar.open(err.error.message, 'OK');
      },
      complete: () => {
        this.spinnerService.stop();
        const ref = this.snackbar.open(Message.OK.TRANSIT_DELETED, 'OK');
        ref.afterDismissed().subscribe(() => {
          this.reloadPage();
        });
      }
    });
  }

  moveToTransit() {
    this.spinnerService.start();
    this.paymentService.moveToTransit(this.payment().id).subscribe({
      error: err => {
        this.spinnerService.stop();
        console.log(err);
        this.snackbar.open('Ошибка перевода на транзитный счет', 'OK');
      },
      complete: () => {
        this.spinnerService.stop();
        const ref = this.snackbar.open(Message.OK.TRANSIT, 'OK');
        ref.afterDismissed().subscribe(() => {
          this.reloadPage();
        });
      }
    });
  }

  private deletePayment() {
    this.spinnerService.start();
    this.subscription = this.paymentService.delete(this.payment().id).subscribe({
      next: data => {
        this.payment.update(p => {
          return {...p, value: data};
        });
      },
      error: err => {
        this.spinnerService.stop();
        this.snackbar.open(err.error.message, 'OK');
      },
      complete: () => {
        this.spinnerService.stop();
        const ref = this.snackbar.open(Message.OK.PAYMENT_DELETED, 'OK');
        ref.afterDismissed().subscribe(() => {
          this.reloadPage();
        });
      }
    });
  }

  private importRegistryDlg() {
    const dialogRef = this.dlg.open(DlgRegistryBufferComponent, {
      width: '50%',
      data: {registry: this.registry},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == null) {
        return;
      }
      if (result === '') {
        return;
      }
      if (result.length > 0) {
        const data = this.paymentService.importRegistryData(result);
        this.payment.update(p => {
          p.registry.push(...data.imported);
          return {...p, value: p};
        });
        if (data.broken.length) {
          this.snackbar.open(`Есть ошибочные строки:\n ${data.broken}`, 'OK');
        }
      }
    });
  }

  private deferPaymentDlg() {
    const dialogRef = this.dlg.open(DlgDeferComponent, {
      width: '30%',
      data: {date: this.deferDate},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(date => {
        if (!date) {
          return;
        }
        if (!this.validateDate(date)) {
          this.snackbar.open(`Дата отложения должна быть больше текущей`, 'OK');
        } else {
          this.deferPayment(new Date(date));
        }
      }
    );
  }

  private openTemplates() {
    this.router.navigate([`company/${this.payment().profileId}/templates`]);
  }

  validateDate(date) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const futureDt = new Date(date);

    if (futureDt.getTime() < tomorrow.getTime()) {

      return false;
    }

    return true;
  }

  private deferPayment(date: Date) {
    this.spinnerService.start();
    const registry: PaymentRegistryItemRequest [] = [];
    this.payment().registry
      .filter(r => r.status === PaymentStatus.NEW)
      .forEach(r => {
        registry.push(new PaymentRegistryItemRequest(r.msisdn, r.account, r.sum, null, null));
      });
    const req = new PaymentDistributionRequest(this.payment().id, registry);
    this.subscription = this.paymentService.defer(req, date.getTime()).subscribe({
      next: data => {
        this.payment.update(p => {
          return {...p, value: data};
        });
      },
      error: err => {
        this.spinnerService.stop();
        this.snackbar.open(`Ошибка! ${err.error.message}`, 'OK');
      },
      complete: () => {
        this.spinnerService.stop();
        const ref = this.snackbar.open(`${Message.OK.DEFERRED} на дату
        ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`, 'OK');
        ref.afterDismissed().subscribe(() => {
          this.reloadPage();
        });
      }
    });
  }

  private cancelMobipay() {
    this.openConfirmDialogCancelMobipay();
  }

  transformDecimal(num) {
    return this.decimalPipe.transform(num, '1.2-2');
  }

  openConfirmDlgDistributeMobipay(partner) {
    let msg;
    if (this.payment().status === PaymentStatus.NEW) {
      msg = `Выполнить разноску платежа на партнера КОД ${partner.code}, Название ${partner.desc}, БИН ${partner.rnn},
        Счет ${partner.account}, Сумма ${this.transformDecimal(this.payment().sum)}?`;
    } else if (this.payment().status === PaymentStatus.DISTRIBUTED) {
      msg = `Отменить платеж партнер КОД ${partner.code}, Название ${partner.desc}, БИН ${partner.rnn},
        Счет ${partner.account}, Сумма ${this.transformDecimal(this.payment().sum)}?`;
    } else {

      return;
    }

    const dlgRef = this.dlg.open(ConfirmationDlgComponent, {
      width: '50%',
      data: {msg: msg},
      disableClose: true
    });

    dlgRef.afterClosed().subscribe(value => {
      if (value === true) {
        this.distributeMobipay(partner);
      }
    });
  }

  openConfirmDialogCancelMobipay() {
    let partner;
    this.spinnerService.start();
    this.mobipayService.getPartners(this.payment().id)
      .pipe(
        switchMap((partners: Partner []) => {
          this.spinnerService.stop();
          partner = partners[0];
          const msg = `Отменить разнесенный ранее платеж партнер КОД ${partner.code}, Название ${partner.desc}, БИН ${partner.rnn},
        Счет ${partner.account}, Сумма ${this.transformDecimal(this.payment().sum)}?`;

          const dlgRef = this.dlg.open(ConfirmationDlgComponent, {
            width: '50%',
            data: {msg: msg},
            disableClose: true
          });
          return dlgRef.afterClosed();
        }),
        switchMap((dialogResult: boolean) => {
          if (dialogResult === true) {
            this.spinnerService.start();

            return this.mobipayService.distribute(this.payment().id, true, partner.code);

          } else {
            const p = new Payment();
            p.status = PaymentStatus.ERR;
            return of(p);
          }
        })
      ).subscribe({
      next: value => {
        if (value === null) {
          const ref = this.snackbar.open('Платеж успешно отменен', 'OK');
          ref.afterDismissed().subscribe(() => {
            this.reloadPage();
          });
        }
        if (value.status = PaymentStatus.ERR) {
          this.snackbar.open('Отмена действия', 'OK');
        }
      },
      error: err => {
        this.spinnerService.stop();
        this.snackbar.open(err.error.message, 'OK');
      },
      complete: () => {
        this.spinnerService.stop();
      }
    });
  }

  reloadPage() {
    location.reload();
  }

  private cancelDeferred() {
    this.spinnerService.start();
    this.paymentService.cancelDeferredPayment(this.route.snapshot.params['id']).subscribe({
      error: err => {
        this.spinnerService.stop();
        console.log(err.error.message);
        this.snackbar.open('Ошибка отмены отложенного платежа', 'OK');
      },
      complete: () => {
        this.spinnerService.stop();
        const ref = this.snackbar.open('Отложенные платеж успешно отменен', 'OK');
        ref.afterDismissed().subscribe(() => {
          this.reloadPage();
        });
      }
    });
  }

  private downloadRegistry() {
    this.excelService.save(this.payment().registry);
  }

  distributeMobipayDialog() {
    this.dialogRef = this.dlg.open(DlgMobipayPartnersComponent, {
      width: '60%', height: '60%',
      data: {
        'paymentId': this.payment().id
      },
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(partner => {

      if (!partner) {
        this.snackbar.open(Message.WAR.MOBIPAY_PICK_PARTNER, 'OK');

        return;
      }

      this.openConfirmDlgDistributeMobipay(partner);
    });
  }

  distributeMobipay(partner: Partner) {
    this.spinnerService.start();
    this.mobipayService.distribute(this.payment().id, false, partner.code).subscribe({
      next: () => {
        const ref = this.snackbar.open(Message.OK.MOBIPAY_DISTR, 'OK');
        ref.afterDismissed().subscribe(() => {
          this.reloadPage();
        });
      },
      error: err => {
        this.spinnerService.stop();
        this.snackbar.open(err.error.message, 'OK');
      },
      complete: () => {
        this.spinnerService.stop();
      }
    });
  }
}
