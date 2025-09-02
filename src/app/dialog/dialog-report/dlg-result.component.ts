import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatList, MatListItem} from '@angular/material/list';
import {MatButton} from '@angular/material/button';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-dialog-report',
  templateUrl: './dlg-result.component.html',
  styleUrls: ['./dlg-result.component.scss'],
  imports: [MatDialogTitle, MatDialogContent, MatList, MatListItem, MatDialogActions, MatButton, MatDialogClose, NgForOf]
})
export class DlgResultComponent {
  constructor(public dialogRef: MatDialogRef<DlgResultComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
