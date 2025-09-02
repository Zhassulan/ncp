import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {PaymentsService, PaymentsType} from '../payments.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {DateRangeMills} from '../model/date-range-mills';
import {MatSort, MatSortHeader, Sort} from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {PaginationParams} from '../model/pagination-params';
import {PaymentStatusPipePipe} from '../payment-status-ru-pipe';
import {navpath, PaymentStatus, SORT_ORDER} from '../../settings';
import {Message} from '../../message';
import {Payment} from '../../payment/model/payment';
import {concatMap, forkJoin, tap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {MobipayService} from '../../mobipay/mobipay.service';
import {PaymentService} from '../../payment/payment.service';
import {DateRangeService} from '../../date-range/date-range.service';
import {ExcelService} from '../../excel/excel.service';
import {DlgMobipayPartnersComponent} from '../../mobipay/partners/dlg-mobipay-partners.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ClientService} from '../../clients/client.service';
import {AuthService} from '../../auth/auth.service';
import {QuickSearchService} from '../../service/quick-search.service';
import {GetPaymentsRequestPageable} from '../../api-dto/get-payments-request-pageable';
import {RawPaymentsService} from '../../raw-payments/raw-payments.service';
import {DeferredPaymentService} from '../../deferred/deferred-payment.service';
import {Utils} from '../../utils';
import {HiddenPaymentsService} from '../../hidden/hidden-payments.service';
import {B2bPaymentsService} from '../../b2b-payments/b2b-payments.service';
import {ConfirmationDlgComponent} from '../../mobipay/confirmation/confirmation-dlg/confirmation-dlg.component';
import {DatePipe, DecimalPipe, NgClass, NgIf} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';
import {SpinnerService} from '../../spinner/spinner.service';
import {environment} from '../../../environments/environment';
import {CollectorService} from '../../collector/collector.service';

const DEFAULT_SORT_COLUMN = 'created';

@Component({
  selector: 'app-payments-table',
  templateUrl: './payments-table-component.html',
  styleUrls: ['./payments-table-component.scss'],
  imports: [MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatSortHeader,
    MatIconButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow,
    MatPaginator, PaymentStatusPipePipe, DatePipe, NgIf, NgClass]
})
export class PaymentsTableComponent implements AfterViewInit {

  paymentStatusPipe: PaymentStatusPipePipe;
  pageSizeOptions: number[] = [1000, 1500, 2000];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string [] = ['id',
    'created',
    'docnum',
    'sender',
    'sum',
    'bin',
    'details',
    'account',
    'agent',
    'knp',
    'status',
    'rowMenu'];
  PaymentStatus = PaymentStatus;
  dialogRef;
  paginationParam: PaginationParams;
  previousDateRange: DateRangeMills;
  loaded = false;
  searchValue;
  sortState = {
    'column': null,
    'order': null
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  readonly router = inject(Router);
  readonly decimalPipe = inject(DecimalPipe);
  readonly spinnerService = inject(SpinnerService);

  isClientPaymentsComponent = false;
  isHiddenComponent = false;

  private collectorService = inject(CollectorService);

  constructor(private paymentsService: PaymentsService,
              private paymentService: PaymentService,
              private snackbar: MatSnackBar,
              private mobipayService: MobipayService,
              private dateRangeService: DateRangeService,
              private excelService: ExcelService,
              private dlg: MatDialog,
              private quicksearchService: QuickSearchService,
              private clientService: ClientService,
              private authService: AuthService,
              private rawPaymentService: RawPaymentsService,
              private deferredPaymentService: DeferredPaymentService,
              private hiddenPaymentsService: HiddenPaymentsService,
              private b2bPaymentsService: B2bPaymentsService,
              private route: ActivatedRoute) {

    this.paginationParam = new PaginationParams(0,
      this.pageSizeOptions[0],
      DEFAULT_SORT_COLUMN,
      SORT_ORDER.DESC);

    this.quicksearchService.valueAnnounced$.subscribe(value => {
      this.searchValue = value;

      if (!quicksearchService.searchParamIsEmpty()) {
        this.search();
      }
    });
  }

  getAuthService() {
    return this.authService;
  }

  getProfileId() {
    return this.route.snapshot.params['id'];
  }

  ngAfterViewInit() {
    const startDate = Utils.getTodayStartTime();
    const endDate = Utils.getTodayEndTime();
    this.dateRangeService.announceStartDate(startDate);
    this.dateRangeService.announceEndDate(endDate);
    this.dateRangeService.announceDateRange(new DateRangeMills(startDate, endDate));

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.loadPayments();

    this.route.data.forEach(data => {
      if (data.breadcrumb === 'Платежи клиента') {
        this.isClientPaymentsComponent = true;
        const sortState: Sort = {active: 'created', direction: 'desc'};
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      } else if (data.breadcrumb === 'Скрытые платежи') {
        this.isHiddenComponent = true;
      }
    });
  }

  buildGetPaymentsRequest(): GetPaymentsRequestPageable {
    return new GetPaymentsRequestPageable(new Date(this.dateRangeService.dateRange.startDate),
      new Date(this.dateRangeService.dateRange.endDate),
      this.searchValue === '' ? null : this.searchValue,
      this.getProfileId(),
      true,
      null,
      this.paginationParam.page,
      this.paginationParam.pageSize,
      this.sortState.column,
      this.sortState.order);
  }

  loadAutoPayments() {
    console.log('Loading auto payments');
    this.loadPaymentsByMethod(this.paymentsService.getAutoPayments(this.buildGetPaymentsRequest()));
  }

  loadRawPayments() {
    console.log('Loading raw payments');
    this.loadPaymentsByMethod(this.rawPaymentService.getPayments(this.buildGetPaymentsRequest()));
  }

  loadDeferredPayments() {
    console.log('Loading deferred payments');
    this.loadPaymentsByMethod(this.deferredPaymentService.getPayments(this.buildGetPaymentsRequest()));
  }

  loadClientPayments() {
    if (this.loaded) {
      this.loadPaymentsByMethod(this.paymentsService.getPayments(this.buildGetPaymentsRequest()));
    } else {
      const $getMinDate = this.paymentsService.getMinDateByProfileId(this.getProfileId());
      const $getMaxDate = this.paymentsService.getMaxDateByProfileId(this.getProfileId());

      forkJoin([$getMinDate, $getMaxDate]).subscribe(([minDate, maxDate]) => {
        this.dateRangeService.announceStartDate(minDate);
        this.dateRangeService.announceEndDate(maxDate);
        this.loaded = true;
        this.loadPaymentsByMethod(this.paymentsService.getPayments(this.buildGetPaymentsRequest()));
      });
    }
  }

  loadHiddenPayments() {
    console.log('Loading hidden payments');
    this.loadPaymentsByMethod(this.paymentsService.getHiddenPayments(this.buildGetPaymentsRequest()));
  }

  loadB2bPayments() {
    console.log('Loading b2b payments');
    this.loadPaymentsByMethod(this.b2bPaymentsService.getPayments(this.buildGetPaymentsRequest()));
  }

  loadGeneralPayments() {
    console.log('Loading general payments');
    this.loadPaymentsByMethod(this.paymentsService.getPayments(this.buildGetPaymentsRequest()));
  }

  loadPaymentsByMethod(method) {
    this.spinnerService.start();
    method.subscribe({
      next: data => {
        this.dataSource.data = data.content;
        setTimeout(() => {
          this.paginator.length = data.total;
          this.paginator.pageIndex = data.pageNumber;
          this.paginator.pageSize = data.pageSize;
        });
      },
      error: err => {
        if (err.status === 0) {
          this.snackbar.open('Сервис не отвечает', 'OK');
        } else {
          this.snackbar.open(`Ошибка. ${err.error.message}`, 'OK');
        }

        this.spinnerService.stop();
      },
      complete: () => {
        this.spinnerService.stop();
      }
    });
  }

  loadPayments() {
    const dateRange = this.dateRangeService.dateRange;

    if (this.paymentsService.paymentsType.valueOf() !== PaymentsType.DEFERRED.valueOf()) {
      if (this.previousDateRange) {
        if (this.previousDateRange.startDate !== dateRange.startDate || this.previousDateRange.endDate !== dateRange.endDate) {
          this.paginationParam.page = 0;
        }
      }
      this.previousDateRange = dateRange;
    }

    if (this.paymentsService.paymentsType.valueOf() === PaymentsType.AUTO.valueOf()) {
      this.loadAutoPayments();
    } else if (this.paymentsService.paymentsType.valueOf() === PaymentsType.DEFERRED.valueOf()) {
      this.loadDeferredPayments();
    } else if (this.paymentsService.paymentsType.valueOf() === PaymentsType.CLIENTS.valueOf()) {
      this.loadClientPayments();
    } else if (this.paymentsService.paymentsType.valueOf() === PaymentsType.RAW.valueOf()) {
      this.loadRawPayments();
    } else if (this.paymentsService.paymentsType.valueOf() === PaymentsType.HIDDEN.valueOf()) {
      this.loadHiddenPayments();
    } else if (this.paymentsService.paymentsType.valueOf() === PaymentsType.B2B.valueOf()) {
      this.loadB2bPayments();
    } else if (this.paymentsService.paymentsType.valueOf() === PaymentsType.COLLEECTOR.valueOf()) {
      this.loadCollectorPayments();
    } else if (this.paymentsService.paymentsType.valueOf() === PaymentsType.GENERAL.valueOf()) {
      this.loadGeneralPayments();
    }
  }

  search() {
    this.loadPayments();
  }

  pageChanged(event: PageEvent) {
    this.paginationParam.pageSize = event.pageSize;
    this.paginationParam.page = event.pageIndex;
    if (this.quicksearchService.searchParamIsEmpty()) {
      this.loadPayments();
    } else {
      this.search();
    }
  }

  menuOnRowOpenPayment(paymentRow) {
    this.openPaymentNewTab(paymentRow);
  }

  menuOnRowDeleteTransit(payment) {
    this.transitDel(payment.id);
  }

  menuOnRowTransit(payment) {
    this.transit(payment.id);
  }

  transit(id) {
    this.spinnerService.start();
    this.paymentService.moveToTransit(id).subscribe({
      error: err => {
        this.spinnerService.stop();
        this.snackbar.open(err.error.message, 'OK');
      },
      complete: () => {
        this.spinnerService.stop();
        this.snackbar.open(Message.OK.TRANSIT, 'OK');
        this.loadPayments();
      }
    });
  }

  transitDel(id) {
    this.spinnerService.start();
    this.paymentService.deleteTransit(id).subscribe({
        error: err => {
          this.spinnerService.stop();
          this.snackbar.open(err, 'OK');
        },
        complete: () => {
          this.spinnerService.stop();
          this.snackbar.open(Message.OK.TRANSIT_DELETED, 'OK');
          this.loadPayments();
        }
      }
    );
  }

  menuOnRowChangeMobipay(payment: Payment) {
    this.changeMobipay(payment);
  }

  changeMobipay(payment: Payment) {
    let isMobipay;
    let profileId;
    this.spinnerService.start();
    this.mobipayService.change(payment.id).pipe(
      tap(response => {
        if (response.success) {
          profileId = response.profileId;
        } else {
          throw new Error(response.message);
        }
      }),
      concatMap(() => this.clientService.isMobipay(profileId)),
      tap(res => isMobipay = res),
    ).subscribe({
      next: () => {
        this.snackbar.open(isMobipay ? 'Успешно переведен в Mobipay платеж' : 'Успешно переведен в обычный платеж', 'OK');
        this.loadPayments();
      },
      error: (err) => {
        this.spinnerService.stop();
        this.snackbar.open(err.error.message, 'OK');
      },
      complete: () => {
        this.spinnerService.stop();
      }
    });
  }

  canTransit(row) {
    return this.paymentService.canTransitByPayment(row) && this.authService.hasEditPaymentRole();
  }

  canDelTransit(row) {
    return this.paymentService.canDelTransitByPayment(row) && this.authService.hasEditPaymentRole();
  }

  export() {
    this.spinnerService.start();
    this.paymentsService.export(this.dateRangeService.dateRange).subscribe({
      next: value => {
        this.excelService.save(value);
      },
      complete: () => {
        this.spinnerService.stop();
      },
      error: err => {
        this.spinnerService.stop();
        console.log(err);
        this.snackbar.open(err.error.message, 'OK');
      }
    });
  }

  menuOnRowDistributeMobipay(payment) {
    this.dialogRef = this.dlg.open(DlgMobipayPartnersComponent, {
      width: '60%', height: '60%',
      data: {
        'paymentId': payment.id
      },
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(partner => {

      if (!partner) {
        this.snackbar.open(Message.WAR.MOBIPAY_PICK_PARTNER, 'OK');

        return;
      }

      this.openConfirmDialogMobipay(partner, payment);

    });
  }

  transformDecimal(num) {
    return this.decimalPipe.transform(num, '1.2-2');
  }

  openConfirmDialogMobipay(partner, payment) {
    let msg;
    if (payment.status === PaymentStatus.NEW) {
      msg = `Выполнить разноску платежа на партнера КОД ${partner.code}, Название ${partner.desc}, БИН ${partner.rnn},
        Счет ${partner.account}, Сумма ${this.transformDecimal(payment.sum)}?`;
    } else if (payment.status === PaymentStatus.DISTRIBUTED) {
      msg = `Отменить платеж партнер КОД ${partner.code}, Название ${partner.desc}, БИН ${partner.rnn},
        Счет ${partner.account}, Сумма ${this.transformDecimal(payment.sum)}?`;
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
        this.distributeMobipay(partner, payment);
      }
    });
  }

  distributeMobipay(partner, row) {
    this.spinnerService.start();
    this.mobipayService.distribute(row.id, row.status === PaymentStatus.DISTRIBUTED, partner.code).subscribe({
      next: () => {
        const ref = this.snackbar.open('Успешно', 'OK');
        ref.afterDismissed().subscribe(() => {
          this.loadPayments();
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

  canMobipayDistribute(row) {
    return row.mobipay && row.status === PaymentStatus.NEW && this.authService.hasMobipayRole()
      && this.authService.hasEditPaymentRole();
  }

  canMobipayCancel(row) {
    return row.mobipay && row.status === PaymentStatus.DISTRIBUTED && this.authService.hasMobipayRole()
      && this.authService.hasEditPaymentRole();
  }

  canMoveToMobipay(row) {
    return this.authService.hasEditPaymentRole() && this.authService.hasMobipayRole() && !row.mobipay;
  }

  canMoveFromMobipay(row) {
    return this.authService.hasEditPaymentRole() && this.authService.hasMobipayRole() && row.mobipay;
  }

  announceSortChange(sortState: Sort) {
    // сортировка
    if (sortState.direction) {
      this.sortState.column = sortState.active;
      this.sortState.order = sortState.direction;
    } else {
      console.log('Sorting is turned off');
      // Сортировка сброшена
      this.sortState = {
        'column': null,
        'order': null
      };
    }

    this.loadPayments();
  }

  openPaymentNewTab(payment) {
    const base_href = environment.production ? '/ncp-frontend' : environment.staging ? '/ncp-frontend-test' : '';
    const url = this.router.serializeUrl(this.router.createUrlTree([`${base_href}/${navpath.payments}/${payment.id}`],
      {queryParams: {}}));
    window.open(url, '_blank');
  }

  hide(row) {
    this.spinnerService.start();
    this.hiddenPaymentsService.hide(row.id, this.authService.getUser()).subscribe({
      next: () => {
        this.loadPayments();
      },
      error: error => {
        this.spinnerService.stop();
        this.snackbar.open('Ошибка скрытия платежа. ' + error.error.message, 'OK');
      },
      complete: () => {
        this.spinnerService.stop();
      }
    });
  }

  unhide(row) {
    this.spinnerService.start();
    this.hiddenPaymentsService.unhide(row.id, this.authService.getUser()).subscribe({
      next: () => {
        this.loadPayments();
      },
      error: error => {
        this.spinnerService.stop();
        this.snackbar.open('Ошибка показа платежа. ' + error.error.message, 'OK');
      },
      complete: () => {
        this.spinnerService.stop();
      }
    });
  }

  canEditPayment() {
    return this.authService.hasEditPaymentRole() && !this.authService.hasReadOnlyRole();
  }

  reloadPage() {
    location.reload();
  }

  loadCollectorPayments() {
    console.log('Loading collector payments');
    this.loadPaymentsByMethod(this.collectorService.getPayments(this.buildGetPaymentsRequest()));
  }
}
