import {Component, Inject, OnDestroy, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {PaymentService} from '../payment.service';
import {RouterService} from '../../router/router.service';
import {Subscription} from 'rxjs';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {Payment} from '../model/payment';

@Component({
  selector: 'app-dialog',
  templateUrl: './dlg-import-router-registry.component.html',
  styleUrls: ['./dlg-import-router-registry.component.scss'],
  imports: [MatDialogTitle, MatButton, MatDialogClose, NgIf]
})
export class DlgImportRouterRegistryComponent implements OnDestroy {

  @ViewChild('file', {static: true}) file;
  fileObj: File;
  showUploadButton = false;
  private subscription: Subscription;

  constructor(public dialogRef: MatDialogRef<DlgImportRouterRegistryComponent>,
              private routerService: RouterService,
              private paymentService: PaymentService,
              @Inject(MAT_DIALOG_DATA) public payment: Payment,
  ) {
  }

  addFile() {
    this.file.nativeElement.click();
  }

  onFileAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (const key in files) {
      if (!isNaN(parseInt(key, 10))) {
        this.fileObj = files[key];
        this.showUploadButton = true;
      }
    }
  }

  upload() {
    this.subscription = this.routerService.registryFromFile(this.fileObj).subscribe(
      () => {
        this.paymentService.addDetailsFromRouterRegistry(this.payment, this.routerService.getItems());
        this.dialogRef.close(this.payment);
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
