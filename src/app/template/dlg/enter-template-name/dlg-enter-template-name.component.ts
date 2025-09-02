import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';

export interface DialogData {
  name: string;
}

@Component({
    selector: 'app-enter-template-name',
    templateUrl: './dlg-enter-template-name.component.html',
    styleUrls: ['./dlg-enter-template-name.component.scss'],
  imports: [MatDialogContent, MatFormField, MatLabel, MatInput, FormsModule, MatDialogActions, MatButton, MatDialogClose]
})
export class DlgEnterTemplateName {

  constructor(public dialogRef: MatDialogRef<DlgEnterTemplateName>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onCancel() {
    this.dialogRef.close();
  }

}
