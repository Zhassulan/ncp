import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {TemplateDetail} from '../model/template-detail';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';

export interface DialogData {
  detail: TemplateDetail;
}

@Component({
  selector: 'app-dlg-template-detail',
  templateUrl: './dlg-template-detail.component.html',
  styleUrls: ['./dlg-template-detail.component.scss'],
  imports: [MatDialogTitle, MatDialogContent, MatFormField, MatLabel, MatInput, FormsModule, MatDialogActions, MatButton,
    MatDialogClose]
})
export class DlgTemplateDetailComponent {

  constructor(public dialogRef: MatDialogRef<DlgTemplateDetailComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onCancel() {
    this.dialogRef.close();
  }
}
