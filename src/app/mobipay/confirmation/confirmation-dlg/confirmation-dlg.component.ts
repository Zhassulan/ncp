import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-confirmation-dlg',
    templateUrl: './confirmation-dlg.component.html',
    styleUrl: './confirmation-dlg.component.scss',
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class ConfirmationDlgComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { msg: string },
              public dialogRef: MatDialogRef<ConfirmationDlgComponent>) {
  }
}
