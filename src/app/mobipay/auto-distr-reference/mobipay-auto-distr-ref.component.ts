import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {ClientProfileDto} from '../../clients/model/clientProfileDto';
import {Subscription} from 'rxjs';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {ClientService} from '../../clients/client.service';
import {MatDialog} from '@angular/material/dialog';
import {PaymentStatus, SORT_ORDER} from '../../settings';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GetClientRequest} from '../../clients/get-client-request';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';

const DEFAULT_SORT_COLUMN = 'clientName';

@Component({
  selector: 'app-auto-distr-reference',
  templateUrl: './mobipay-auto-distr-ref.component.html',
  styleUrls: ['./mobipay-auto-distr-ref.component.scss'],
  imports: [MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell,
    MatIconButton, MatTooltip, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator]
})
export class MobipayAutoDistrRefComponent implements OnInit,
  OnDestroy,
  AfterViewInit {

  dataSource: MatTableDataSource<ClientProfileDto> = new MatTableDataSource();
  private subscription: Subscription;
  pageSize = 10;
  totalRows = 0;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 30];
  displayedColumns: string[] = ['clientName',
    'clientIin',
    'managedBy',
    'types',
    'segments',
    'delete'];
  PaymentStatus = PaymentStatus;
  dialogRef;
  inputClientIIN;
  inputClientName;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() isMobipay: boolean;

  constructor(private snackbar: MatSnackBar,
              private clntService: ClientService,
              public dlg: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.loadData(undefined,
      undefined,
      this.isMobipay);
  }

  loadData(clientBin: string,
           clientName: string,
           mobipay: boolean) {


    const req = new GetClientRequest(clientBin, clientName, mobipay, this.currentPage, this.pageSize,
      DEFAULT_SORT_COLUMN, SORT_ORDER.DESC);
    this.clntService.getClients(req).subscribe({
      next: value => {
        this.dataSource.data = value.content;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = value.total;
        });
      },
      error: error => {
        console.log(error);
        this.snackbar.open(`Ошибка загрузки клиентов`, 'OK');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData(this.inputClientIIN, this.inputClientName, this.isMobipay);
  }
}
