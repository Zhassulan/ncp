import {AfterContentChecked, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {TemplateService} from '../template.service';
import {TemplateDetail} from '../model/template-detail';
import {Template} from '../model/template';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';


@Component({
  selector: 'app-template-details-table',
  templateUrl: './template-details-table.component.html',
  styleUrls: ['./template-details-table.component.scss'],
  imports: [MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCheckbox, MatCellDef, MatCell,
    MatSortHeader, MatIconButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem, MatHeaderRowDef, MatHeaderRow,
    MatRowDef, MatRow, MatPaginator]
})
export class TemplateDetailsTableComponent implements OnInit, AfterContentChecked {

  @Input() template: Template;
  displayedColumns = [
    'select',
    'no',
    'msisdn',
    'account',
    'sum',
    'menu'];
  dataSource = new MatTableDataSource<TemplateDetail>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  selection = new SelectionModel<TemplateDetail>(true, []);
  @Output() reload = new EventEmitter<boolean>();

  constructor(private templateService: TemplateService,
              private snackbar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onDelete(detail) {
    this.deleteDetail(detail);
  }

  deleteDetail(detail) {
    this.templateService.deleteDetail(this.template.id, detail.id).subscribe({
      next: () => this.reload.emit(true),
      error: error => {
        console.log(error);
        this.snackbar.open('Ошибка удаления регистра', 'OK');
      }
    });
  }

  ngAfterContentChecked(): void {
    if (this.template) {
      if (this.dataSource.data.length === 0) {
        this.dataSource.data = this.template.details;
      }
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
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.no + 1}`;
  }
}
