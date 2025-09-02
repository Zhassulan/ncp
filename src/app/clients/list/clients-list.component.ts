import {AfterViewInit, Component, inject, Input, model, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {ClientService} from '../client.service';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DlgImportLimitsComponent} from '../../mobipay/limits/dialog/dlg-import-limits.component';
import {PaymentStatus, SORT_ORDER} from '../../settings';
import {ClientProfileDto} from '../model/clientProfileDto';
import {AuthService} from '../../auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GetClientRequest} from '../get-client-request';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {NgClass, NgIf} from '@angular/common';
import {SpinnerService} from '../../spinner/spinner.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatCheckbox} from '@angular/material/checkbox';

const DEFAULT_SORT_COLUMN = 'clientName';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  imports: [
    MatPaginatorModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatSortModule,
    NgIf,
    MatCheckbox,
    NgClass
  ],
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit, OnDestroy, AfterViewInit {

  dataSource: MatTableDataSource<ClientProfileDto> = new MatTableDataSource();
  private subscription: Subscription;
  pageSize = 10;
  totalRows = 0;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 30];
  displayedColumns: string[] = ['client', 'bin', 'managedBy', 'types', 'segments', 'payments', 'profile'];
  PaymentStatus = PaymentStatus;
  inputClientIIN;
  inputClientName;
  profile = model<ClientProfileDto>();
  selection = new SelectionModel<ClientProfileDto>(false, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() isMobipay: boolean;
  @Input() isCollector: boolean;

  readonly dlg = inject(MatDialog);
  readonly snackbar = inject(MatSnackBar);
  readonly spinnerService = inject(SpinnerService);
  readonly router = inject(Router);
  readonly clntService = inject(ClientService);
  readonly authService = inject(AuthService);

  constructor() {
    this.selection.changed.subscribe({
      next: data => {
        console.log(data.added[0]);
        this.profile.update(p => {
          return {...p, value: data.added[0]};
        });
      },
      error: err => {},
      complete: () => {}
    });
  }

  ngOnInit(): void {
    this.loadData(null, null, this.isMobipay);
  }

  loadData(bin: string, client: string, mobipay: boolean) {
    const req = new GetClientRequest(bin, client, mobipay, this.currentPage, this.pageSize, DEFAULT_SORT_COLUMN, SORT_ORDER.DESC);
    this.spinnerService.start();
    this.clntService.getClients(req).subscribe({
      next: data => {
        this.dataSource.data = data.content;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = data.total;
        });
      },
      error: err => {
        console.log(err);
        this.spinnerService.stop();
        this.snackbar.open(`Ошибка загрузки клиентов`, 'OK');
      },
      complete: () => this.spinnerService.stop()
    });
  }

  applyFilterClientIIN() {
    this.inputClientName = null;
  }

  applyFilterClientName() {
    this.inputClientIIN = null;
  }

  openClientPayments(client) {
    this.clntService.client = client;
    this.router.navigate([`clients/${client.id}/payments`]);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  find() {
    if (this.inputClientName != null && this.inputClientName.length > 0) {
      this.loadData(null, this.inputClientName.trim(), this.isMobipay);
    }

    if (this.inputClientIIN != null && this.inputClientIIN.length > 0) {
      this.loadData(this.inputClientIIN.trim(), null, this.isMobipay);
    }
  }

  dlgUpdateLimits() {
    this.dlg.open(DlgImportLimitsComponent, {
      width: '40%',
      height: '70%',
      disableClose: true
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData(this.inputClientIIN, this.inputClientName, this.isMobipay);
  }

  sortData(sort: Sort) {
    // this.loadData(sort);
  }

  openClientProfile(client) {
    this.clntService.client = client;
    this.router.navigate([`profile/${client.id}`]);
  }

  hasMobipayLimitsUpdateRole(): boolean {
    return this.authService.hasMobipayLimitsUpdateRole();
  }

  hasViewClientProfileRole() {
    return this.authService.hasViewClientProfileRole();
  }

  hasReadOnlyRole() {
    return this.authService.hasReadOnlyRole();
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
      this.find();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
