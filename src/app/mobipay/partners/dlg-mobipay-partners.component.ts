import {AfterViewInit, Component, inject, Inject, Input, OnDestroy} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {MobipayService} from '../mobipay.service';
import {MatSnackBar} from '@angular/material/snack-bar';
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
  MatTable
} from '@angular/material/table';
import {MatButton} from '@angular/material/button';
import {SpinnerService} from '../../spinner/spinner.service';

@Component({
  selector: 'app-partners',
  templateUrl: './dlg-mobipay-partners.component.html',
  styleUrls: ['./dlg-mobipay-partners.component.scss'],
  imports: [MatDialogTitle, MatDialogContent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell,
    MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatDialogActions, MatButton, MatDialogClose]
})
export class DlgMobipayPartnersComponent implements AfterViewInit, OnDestroy {

  dataSource;
  displayedColumns: string[] = ['code', 'name', 'account', 'bin'];
  @Input() paymentId;
  subscription: Subscription;
  readonly spinnerService = inject(SpinnerService);

  constructor(private dlgRef: MatDialogRef<DlgMobipayPartnersComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private mobipayService: MobipayService,
              private snackbar: MatSnackBar,
  ) {
  }

  ngAfterViewInit(): void {
    this.spinnerService.start();
    this.subscription = this.mobipayService.getPartners(this.data.paymentId).subscribe({
      next: value => {
        this.dataSource = value;
      },
      error: err => {
        this.spinnerService.stop();
        console.log(err);
        this.snackbar.open('Ошибка получения партнеров', 'OK');
      },
      complete: () => {
        this.spinnerService.stop();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onRowClick(row) {
    this.dlgRef.close(row);
  }
}
