import {Component, inject, signal} from '@angular/core';
import {ClientsListComponent} from '../../clients/list/clients-list.component';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatHint, MatInput} from '@angular/material/input';
import {SpinnerService} from '../../spinner/spinner.service';
import {CollectorService} from '../collector.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {navpath} from '../../settings';
import {ClientProfileDto} from '../../clients/model/clientProfileDto';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-add-collector',
  imports: [
    ClientsListComponent,
    FormsModule,
    MatButton,
    MatFormField,
    MatHint,
    MatInput,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './add-collector.component.html',
  styleUrl: './add-collector.component.scss'
})
export class AddCollectorComponent {

  branch = new FormControl('');
  spinner = inject(SpinnerService);
  collectorService = inject(CollectorService);
  snackbar = inject(MatSnackBar);
  router = inject(Router);
  profile = signal<ClientProfileDto>(undefined);

  constructor() {
    /*effect(() => {
      console.log(`Selected profile: ${JSON.stringify(this.profile())}`); // .value.profile ???
    });*/
  }

  add() {
    // @ts-ignore
    const p: ClientProfileDto = this.profile().value;
    this.spinner.start();
    this.collectorService.add(p.id, this.branch.value).subscribe({
      next: collector => {
        const ref = this.snackbar.open(`Клиент ${collector.clientProfile.clientName}, ${collector.clientProfile.clientIin}
          успешно добавлен в справочник ЧСИ`, 'OK');
        ref.afterDismissed().subscribe(() => {
          this.router.navigate([navpath.collector]);
        });
      },
      error: error => {
        this.spinner.stop();
        console.log(error);
        this.snackbar.open(`Ошибка! ${error.error.message}`, 'OK');
      },
      complete: () => this.spinner.stop()
    });
  }

  cancel() {
    this.router.navigate([navpath.collector]);
  }
}
