import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {ClientService} from '../../client.service';
import {ActivatedRoute} from '@angular/router';
import {RegionService} from '../../../region/region.service';
import {concatMap, tap} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ClientContract} from '../../contract/model/client-contract';
import {MatDialog} from '@angular/material/dialog';
import {AddContractComponent} from '../add-contract/add-contract.component';
import {MatError, MatFormField, MatHint, MatInput, MatLabel} from '@angular/material/input';
import {NgFor, NgIf} from '@angular/common';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/autocomplete';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {SpinnerService} from '../../../spinner/spinner.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-edit-client-profile',
  templateUrl: './edit-client-profile.component.html',
  styleUrls: ['./edit-client-profile.component.scss'],
  imports: [MatFormField, MatInput, FormsModule, ReactiveFormsModule, MatLabel, MatHint, NgIf, MatError, MatSelect,
    NgFor, MatOption, MatButton, MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader,
    MatCellDef, MatCell, MatIconButton, MatTooltip, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow,
    MatPaginator]
})
export class EditClientProfileComponent implements OnInit, AfterViewInit {

  titleFormControl = new UntypedFormControl();
  binFormControl = new UntypedFormControl();
  contactPersonFormControl = new UntypedFormControl();
  contactPhoneFormControl = new UntypedFormControl();
  emailFormControl = new UntypedFormControl('', [Validators.required, Validators.email]);
  addressFormControl = new UntypedFormControl();
  regionFormControl = new UntypedFormControl();

  matcher = new MyErrorStateMatcher();

  dataSource: MatTableDataSource<ClientContract> = new MatTableDataSource();
  pageSize = 10;
  totalRows = 0;
  pageSizeOptions: number[] = [10, 20, 30];
  displayedColumns: string[] = ['clientId',
    'contractNumber',
    'bik',
    'iin',
    'payAccount',
    'manager',
    'delete'];
  profile;
  regions;
  region;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  readonly spinnerService = inject(SpinnerService);

  constructor(private clientService: ClientService,
              private route: ActivatedRoute,
              private regionService: RegionService,
              private snackbar: MatSnackBar,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.spinnerService.start();
    this.clientService.getClientProfileById(this.route.snapshot.params['id']).subscribe({
      next: data => {
        this.profile = data;
        this.setProfileFormFields(this.profile);
      },
      error: error => {
        this.spinnerService.stop();
        this.snackbar.open('Ошибка загрузки профиля клиента. ' + error.error.message, 'OK');
      },
      complete: () => this.spinnerService.stop()
    });

    this.findAllContracts(this.route.snapshot.params['id'],
      this.pageSize,
      this.pageIndex);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  setProfileFormFields(profile) {
    this.titleFormControl.setValue(profile.client);
    this.binFormControl.setValue(profile.bin);
    this.contactPersonFormControl.setValue(profile.person);
    this.contactPhoneFormControl.setValue(profile.phone);
    this.emailFormControl.setValue(profile.email);
    this.addressFormControl.setValue(profile.address);
    this.regionService.findAll().subscribe({
      next: data => {
        this.regions = data;
        this.region = data.find((obj) => {
          return obj.addressId === profile.regionId;
        });
        if (!this.region) {
          this.region = {
            id: 0,
            addressId: 0,
            address: 'Не указан'
          };
        }
      }
    });
  }

  click(element) {

  }

  delete(element) {
    this.clientService.deleteContract(element.id, element.profileId).subscribe({
      next: () => {
        this.findAllContracts(this.route.snapshot.params['id'],
          this.pageSize,
          this.paginator.pageIndex);
      },
      error: err => {
        console.log(err.message);
        this.snackbar.open('Ошибка удаления контракта', 'OK');
      },
      complete: () => {
        this.snackbar.open('Контракт удален.', 'OK');
      }
    });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.findAllContracts(this.route.snapshot.params['id'],
      this.pageSize,
      this.paginator.pageIndex);
  }

  findAllContracts(profileId, pageSize, pageIndex) {
    let totalContracts = 0;
    this.spinnerService.start();
    this.clientService.getTotalContractsNumber(profileId).pipe(
      tap(res => totalContracts = res),
      concatMap(() => this.clientService.findAllContractsByIdPageable(profileId,
        pageSize,
        pageIndex))
    ).subscribe({
      next: data => {
        this.dataSource.data = data;
        setTimeout(() => {
          this.paginator.pageIndex = pageIndex;
          this.paginator.length = totalContracts;
        });
      },
      error: err => {
        this.spinnerService.stop();
        console.log(err.error.message);
        this.snackbar.open('Ошибка при получении контрактов. ' + err.error.message, 'OK');
      },
      complete: () => this.spinnerService.stop()
    });
  }

  addContractClick() {
    this.openAddContractDialog();
  }

  openAddContractDialog(): void {
    const bodyRect = document.body.getBoundingClientRect();

    const dialogRef = this.dialog.open(AddContractComponent, {
      width: '60%',
      data: {profileId: this.profile.id},
      disableClose: true,
      position: {right: bodyRect.width / 5 + 'px', top: bodyRect.height / 10 + 'px'},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.findAllContracts(this.route.snapshot.params['id'], this.pageSize, this.pageIndex);
    });
  }

  saveClick() {
    let isUpdated = false;
    const newProfile = {...this.profile};

    if (this.profile.title !== this.titleFormControl.value) {
      newProfile.title = this.titleFormControl.value;
      isUpdated = true;
    }
    if (this.profile.bin !== this.binFormControl.value) {
      newProfile.bin = this.binFormControl.value;
      isUpdated = true;
    }
    if (this.profile.person !== this.contactPersonFormControl.value) {
      newProfile.person = this.contactPersonFormControl.value;
      isUpdated = true;
    }
    if (this.profile.phone !== this.contactPhoneFormControl.value) {
      newProfile.phone = this.contactPhoneFormControl.value;
      isUpdated = true;
    }
    if (this.profile.email !== this.emailFormControl.value) {
      newProfile.email = this.emailFormControl.value;
      isUpdated = true;
    }
    if (this.profile.address !== this.addressFormControl.value) {
      newProfile.address = this.addressFormControl.value;
      isUpdated = true;
    }

    if (isUpdated) {
      this.clientService.updateProfile(newProfile).subscribe({
        next: () => this.snackbar.open('Профиль обновлен', 'OK'),
        error: err => {
          console.log(err);
          this.snackbar.open('Ошибка при обновлении профиля', 'OK');
        }
      });
    }
  }
}
