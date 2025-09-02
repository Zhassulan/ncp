import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import {RegistryDetail} from '../model/registry-detail';
import { CurrencyPipe } from '@angular/common';
import { PhonePipe } from '../../payment/phone-pipe';


@Component({
    selector: 'app-registry-details',
    templateUrl: './registry-details.component.html',
    styleUrls: ['./registry-details.component.scss'],
    imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator, CurrencyPipe, PhonePipe]
})
export class RegistryDetailsComponent implements OnInit {

    dataSource = new MatTableDataSource<RegistryDetail>();
    displayedColumns: string [] = [ 'num', 'msisdn', 'amount'];
    paginatorResultsLength = 0;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @Input() details;

    ngOnInit() {
        this.dataSource.data = this.details;
        this.paginatorResultsLength = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

}
