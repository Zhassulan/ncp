import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {MatDialogClose, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MobipayService} from '../../mobipay.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MobipayLimit} from '../../model/mobipay-limit';
import {MatPaginator} from '@angular/material/paginator';
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
import {MobipayLimitWithPosition} from '../../model/mobipay-limit-with-position';
import {DlgService} from '../../../dialog/dlg.service';
import {MatButton} from '@angular/material/button';
import {SpinnerService} from '../../../spinner/spinner.service';

import * as XLSX from 'xlsx';
import {NgIf} from '@angular/common';

type AOA = any[][];

@Component({
  selector: 'app-dialog',
  templateUrl: './dlg-import-limits.component.html',
  styleUrls: ['./dlg-import-limits.component.scss'],
  imports: [MatDialogTitle, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef,
    MatHeaderRow, MatRowDef, MatRow, MatPaginator, MatButton, MatDialogClose, NgIf]
})
export class DlgImportLimitsComponent implements AfterViewInit {

  @ViewChild('file', {static: true}) file;
  fileObj: File;
  showApplyButton = false;
  limits: MobipayLimit [] = [];
  limitsWithPosition: MobipayLimitWithPosition [] = [];
  displayedColumns: string[] = ['position', 'partnerCode', 'limit'];
  dataSource: MatTableDataSource<MobipayLimitWithPosition> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  readonly dialogRef = inject(MatDialogRef<DlgImportLimitsComponent>);
  readonly mobipayService = inject(MobipayService);
  readonly snackbar = inject(MatSnackBar);
  readonly dlgService = inject(DlgService);
  readonly spinnerService = inject(SpinnerService);

  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  addFile() {
    this.file.nativeElement.click();
  }

  readFile(file) {
    /* wire up file reader */
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.convertArrayToLimits();
      this.apply();
    };
    reader.readAsBinaryString(file);
  }

  convertArrayToLimits() {
    this.data
      .filter(item => item.length > 0)
      .filter(item => item[0] !== 'Code')
      .forEach(item => {
        console.log(item);
        this.limits.push(new MobipayLimit(item[0], item[1]));
      });
  }

  onFileAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (const key in files) {
      if (!isNaN(parseInt(key, 10))) {
        this.fileObj = files[key];
      }
    }

    if (this.fileObj) {
      // this.upload();
      this.readFile(this.fileObj);
    }
  }

  upload() {
    this.spinnerService.start();
    this.mobipayService.uploadLimits(this.fileObj).subscribe({
      next: data => {
        this.limits = data;
        let i = 0;
        this.limitsWithPosition = [];
        for (const l of this.limits) {
          i += 1;
          this.limitsWithPosition.push(new MobipayLimitWithPosition(i, l.partnerCode, l.limit));
        }
        if (this.limitsWithPosition.length > 0) {
          this.showApplyButton = true;
          this.dataSource.data = this.limitsWithPosition;
        }
      },
      error: err => {
        this.spinnerService.stop();
        console.log(err);
        this.snackbar.open('Ошибка при загрузке лимитов мобипей из файла', 'OK');
      },
      complete: () => this.spinnerService.stop()
    });
  }

  apply() {
    this.spinnerService.start();
    this.mobipayService.applyLimits(this.limits).subscribe({
      next: data => {
        this.mobipayService.mobipayLimitsUpdateResponses = data;
        this.dialogRef.close({data});
        this.dlgService.clear();
        let counter = 1;
        this.dlgService.addItem('Результаты обновления лимитов мобипей:');
        this.dlgService.addItem('');
        this.mobipayService.mobipayLimitsUpdateResponses.forEach(i => {
          this.dlgService.addItem(`${counter++}) код партнера: ${i.partnerCode}`);
          this.dlgService.addItem(`  код результата: ${i.resCode}`);
          this.dlgService.addItem(`  результат: ${i.resMsg}`);
          this.dlgService.addItem(`  предыдущий лимит: ${i.oldLimit}`);
          this.dlgService.addItem(`  текущий лимит: ${i.limit}`);
          this.dlgService.addItem('');
        });
        this.dlgService.openDialog();
      },
      error: err => {
        console.log(err);
        this.spinnerService.stop();
        const ref = this.snackbar.open('Ошибка обновления мобипей лимитов', 'OK');
        ref.afterDismissed().subscribe(() => {
          this.dialogRef.close();
        });
      },
      complete: () => {
        this.spinnerService.stop();
        this.dialogRef.close();
      }
    });
  }
}
