import {AfterViewInit, Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
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
import {MatSnackBar} from '@angular/material/snack-bar';
import {CollectorService} from '../collector.service';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatTooltip} from '@angular/material/tooltip';
import {ConfirmationDlgComponent} from '../../mobipay/confirmation/confirmation-dlg/confirmation-dlg.component';
import {MatDialog} from '@angular/material/dialog';
import {SpinnerService} from '../../spinner/spinner.service';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';
import {navpath} from '../../settings';

@Component({
  selector: 'app-collector',
  imports: [
    FormsModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatTooltip,
    MatMenuTrigger
  ],
  templateUrl: './collector.component.html',
  styleUrl: './collector.component.scss'
})
export class CollectorComponent implements AfterViewInit {

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['client', 'bin', 'branch', 'menu'];
  readonly dialog = inject(MatDialog);
  readonly spinnerService = inject(SpinnerService);
  readonly collectorService = inject(CollectorService);
  readonly snackbar = inject(MatSnackBar);
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  constructor() {
    this.loadData();
  }

  ngAfterViewInit(): void {
    if (!this.authService.hasCollectorRole()) {
      this.router.navigate([navpath.payments]);
    }
  }

  loadData() {
    this.spinnerService.start();
    this.collectorService.findAll(1, 100).subscribe({
      next: value => this.dataSource.data = value.content,
      error: error => {
        this.spinnerService.stop();
        console.log(error);
        this.snackbar.open('Ошибка загрузки списка ЧСИ', 'OK');
      },
      complete: () => this.spinnerService.stop()
    });
  }

  del(element) {
    const msg = `Подтвердите удаление ${element.clientProfile.clientName} (${element.clientProfile.clientIin})`;
    const dlgRef = this.dialog.open(ConfirmationDlgComponent, {
      width: '50%',
      data: {msg: msg},
      disableClose: true
    });

    dlgRef.afterClosed().subscribe(value => {
      if (value === true) {
        this.spinnerService.start();
        this.collectorService.delete(element.id).subscribe({
          next: () => {
            const ref = this.snackbar.open('Успешно удален', 'OK');
            ref.afterDismissed().subscribe(() => this.loadData());
          },
          error: error => {
            this.spinnerService.stop();
            console.log(error);
            this.snackbar.open('Ошибка удаления. ' + error.error.message, 'OK');
          },
          complete: () => this.spinnerService.stop()
        });
      }
    });
  }

  add() {
    this.router.navigate([navpath.collector_add]);

  }
}
