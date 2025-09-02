import {Component} from '@angular/core';
import {ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PaymentsService} from '../payments/payments.service';
import {ImportRequest} from './dto/import-request';
import {AuthService} from '../auth/auth.service';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButton} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {NgIf} from '@angular/common';
import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButton, NgIf, ReactiveFormsModule]
})
export class ImportComponent {

  importDate = new UntypedFormControl();

  constructor(private snackbar: MatSnackBar,
              private paymentsService: PaymentsService,
              private authService: AuthService) {
  }

  importClick() {
    if (!this.importDate.value) {
      this.snackbar.open('Укажите дату', 'OK');
      return;
    }
    this.import();
  }

  import() {

    const dt: Date = this.importDate.value;
    const from: Date = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() - 1, 18, 0, 0, 0);
    const to: Date = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 18, 0, 0, 0);
    this.paymentsService.import(new ImportRequest(from.getTime(), to.getTime())).subscribe({
      error: err => {
        console.log(err);
        this.snackbar.open('Ошибка при импорте', 'OK');

      },
      complete: () => {
        this.snackbar.open('Команда импорта отправлена успешно', 'OK');

      }
    });
  }

  hasReadOnlyRole() {
    return this.authService.hasReadOnlyRole();
  }
}
