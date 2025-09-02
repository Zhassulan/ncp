import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {RegistryDialogData} from '../payment.component';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-add-registry-modal',
  templateUrl: './dlg-registry-buffer.component.html',
  styleUrls: ['./dlg-registry-buffer.component.scss'],
  imports: [MatDialogTitle, MatDialogContent, MatFormField, MatLabel, MatInput, FormsModule, MatDialogActions, MatButton,
    MatDialogClose]
})
export class DlgRegistryBufferComponent {

  constructor(
    public dialogRef: MatDialogRef<DlgRegistryBufferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RegistryDialogData) {
  }
}
