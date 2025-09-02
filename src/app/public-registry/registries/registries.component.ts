import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
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
import {ExcelService} from '../../excel/excel.service';
import {Router} from '@angular/router';
import {DateRangeService} from '../../date-range/date-range.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PublicRegistryInDto} from '../dto/public-registry-in-dto';
import {DateRangeMills} from '../../payments/model/date-range-mills';
import {PaginationParams} from '../../payments/model/pagination-params';
import {SORT_ORDER} from '../../settings';
import {PublicRegistryService} from '../public-registry.service';
import {concatMap, tap} from 'rxjs';
import {DatePipe, NgClass} from '@angular/common';
import {DateRangeComponent} from '../../date-range/date-range.component';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatFormField, MatInput, MatSuffix} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {SpinnerService} from '../../spinner/spinner.service';

const DEFAULT_SORT_COLUMN = 'created';

@Component({
  selector: 'app-registries',
  templateUrl: './registries.component.html',
  styleUrls: ['./registries.component.scss'],
  imports: [NgClass, DateRangeComponent, MatButton, MatTooltip, MatFormField, MatInput, FormsModule, MatIcon, MatSuffix,
    MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatIconButton, MatMenuTrigger,
    MatMenu, MatMenuItem, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator, DatePipe]
})
export class RegistriesComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['ID',
    'created',
    'bin',
    'company',
    'phone',
    'email',
    'total',
    'rowMenu'
  ];
  dataSource: MatTableDataSource<PublicRegistryInDto> = new MatTableDataSource();
  pageSize = 10;
  totalRows = 0;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 30];
  inputBin;

  constructor(private excelService: ExcelService,
              private router: Router,
              private dateRangeService: DateRangeService,
              private snackbar: MatSnackBar,
              private publicRegistryService: PublicRegistryService,
              private spinnerService: SpinnerService) {

    this.dateRangeService.dateRangeAnnounced$.subscribe(() => {
      if (this.dateRangeService.isInvalidLoadDataRequest()) {
        this.snackbar.open('Нет данных', 'OK');
      } else {
        this.loadData(this.dateRangeService.dateRange, undefined);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    let minDate: Date;
    let maxDate: Date;
    this.publicRegistryService.minDate(undefined).pipe(
      tap(res => minDate = new Date(res)),
      concatMap(() => this.publicRegistryService.maxDate(undefined)),
      tap(res => maxDate = new Date(res)),
    ).subscribe({
      next: () => {
        this.dateRangeService.announceDateRange(new DateRangeMills(minDate, maxDate));
        this.dateRangeService.announceStartDate(minDate);
        this.dateRangeService.announceEndDate(maxDate);
      },
      error: (err) => {
        console.log(err);
        this.snackbar.open('Ошибка получения максимальной даты для реестров', 'OK');
      }
    });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData(this.dateRangeService.dateRange, undefined);
  }

  export() {
    this.publicRegistryService.export(this.dateRangeService.dateRange).subscribe({
      next: value => {
        this.excelService.save(value);
      },
      error: err => {
        console.log(err);
        this.snackbar.open('Ошибка экспорта', 'OK');
      }
    });
  }

  menuOnRegistryOpen(registry) {
    this.router.navigate([`registries/${registry.id}`]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.loadData(this.dateRangeService.dateRange, filterValue);
  }

  loadData(dateRange: DateRangeMills, bin: string) {
    this.spinnerService.start();
    this.publicRegistryService.findAll(bin,
      dateRange,
      new PaginationParams(this.currentPage,
        this.pageSize,
        DEFAULT_SORT_COLUMN,
        SORT_ORDER.DESC))
      .subscribe({
        next: data => {
          this.dataSource.data = data.content;
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = data.totalElements;
          });
        },
        error: error => {
          this.spinnerService.stop();
          console.log(error);
          this.snackbar.open('Ошибка получения публичных реестров', 'OK');
        },
        complete: () => this.spinnerService.stop()
      });
  }
}
