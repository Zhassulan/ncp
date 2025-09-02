import {AfterContentChecked, AfterViewInit, Component, Input, ViewChild} from '@angular/core';
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
import {Router} from '@angular/router';
import {Template} from '../model/template';
import {TemplateService} from '../template.service';
import {SelectionModel} from '@angular/cdk/collections';
import {ProfileEntity} from '../../clients/profileEntity';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-templates-table',
  templateUrl: './templates-table.component.html',
  styleUrls: ['./templates-table.component.scss'],
  imports: [MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCheckbox, MatCellDef, MatCell,
    MatSortHeader, MatIconButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem, MatHeaderRowDef, MatHeaderRow,
    MatRowDef, MatRow, MatPaginator]
})
export class TemplatesTableComponent implements AfterViewInit, AfterContentChecked {

  displayedColumns = [
    'select',
    'no',
    'name',
    'company',
    'bin',
    'menu'];
  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;
  @ViewChild(MatSort, {static: true})
  sort: MatSort;
  dataSource = new MatTableDataSource<Template>();
  selection = new SelectionModel<Template>(true, []);
  @Input() profile: ProfileEntity;

  constructor(private router: Router,
              private templateService: TemplateService,
              public dialog: MatDialog,
              private snackbar: MatSnackBar) {
  }

  onOpenTemplate(template: Template) {
    this.openTemplate(template.id);
  }

  openTemplate(id) {
    this.router.navigate([`templates/${id}`]);
  }

  delete(template: Template) {

    this.templateService.delete(template.id).subscribe(
      data => {
        this.retrieve();
      },
      error => {
        console.log(error);
        this.snackbar.open('Ошибка удаления шаблона', 'OK');

      });
  }

  retrieve() {
    this.templateService.findAllByProfileId(this.profile.id).subscribe(
      data => this.dataSource.data = data);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  ngAfterContentChecked(): void {
    if (this.profile) {
      if (this.dataSource.data.length === 0) {
        this.retrieve();
      }
    }
  }
}
