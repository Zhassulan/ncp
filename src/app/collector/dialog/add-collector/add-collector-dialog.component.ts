import {Component, OnDestroy} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatDialogClose} from '@angular/material/dialog';

import {ClientsListComponent} from '../../../clients/list/clients-list.component';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatHint, MatInput} from '@angular/material/input';

@Component({
  selector: 'app-add-collector',
  imports: [
    MatButton,
    MatDialogClose,
    ClientsListComponent,
    FormsModule,
    MatInput,
    ReactiveFormsModule,
    MatFormField,
    MatHint
  ],
  templateUrl: './add-collector-dialog.component.html',
  styleUrl: './add-collector-dialog.component.scss'
})
export class AddCollectorDialogComponent implements OnDestroy {

  branch = new FormControl('');

  ngOnDestroy(): void {
    console.log(this.branch.value);
  }
}
