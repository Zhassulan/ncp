import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {CalendarDialogData} from '../payment.component';
import {MatInputModule, MatLabel, MatSuffix} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';

@Component({
  selector: 'app-calendar-defer-modal',
  templateUrl: './dlg-defer.component.html',
  styleUrls: ['./dlg-defer.component.scss'],
  imports: [MatDatepickerModule, MatInputModule, FormsModule, MatFormFieldModule, MatNativeDateModule, MatDialogTitle,
    MatDialogContent, MatLabel, MatSuffix, MatDialogActions, MatButton, MatDialogClose,   MatNativeDateModule ]
})
export class DlgDeferComponent {

  constructor(public dialogRef: MatDialogRef<DlgDeferComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CalendarDialogData) {
  }
}
