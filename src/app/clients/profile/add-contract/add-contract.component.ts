import {AfterViewInit, Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
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
import {ContractsService} from '../../contract/contracts.service';
import {FindContractRequest} from '../../contract/dto/find-contract-request';
import {AddContractParams} from '../../contract/dto/add-contract-params';
import {ClientContract} from '../../contract/model/client-contract';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Utils} from '../../../utils';
import {ClientService} from '../../client.service';
import {AuthService} from '../../../auth/auth.service';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';

class Contract {
  bercutClientId;
  contractNum;
  title;
  bin;
  payAccount;

  constructor(bercutClientId, contractNum, title, bin, payAccount) {
    this.bercutClientId = bercutClientId;
    this.contractNum = contractNum;
    this.title = title;
    this.bin = bin;
    this.payAccount = payAccount;
  }
}

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss'],
  imports: [MatTabGroup, MatTab, MatRadioGroup, FormsModule, MatRadioButton, MatButton, MatFormField, MatInput,
    ReactiveFormsModule, MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef,
    MatCell, MatIconButton, MatTooltip, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator]
})
export class AddContractComponent implements AfterViewInit {

  searchInputFormControl = new UntypedFormControl();

  dataSource: MatTableDataSource<Contract> = new MatTableDataSource();
  pageSize = 10;
  totalRows = 0;
  pageSizeOptions: number[] = [10, 20, 30];
  displayedColumns: string[] = ['clientId',
    'contractNumber',
    'title',
    'iin',
    'payAccount',
    'add',
    'delete'];
  regions;
  region;
  pageIndex = 0;
  radioOption;
  selectedContracts: Contract [] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialogRef: MatDialogRef<AddContractComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: any,
              private contractsService: ContractsService,
              private snackbar: MatSnackBar,
              private clientService: ClientService,
              private authService: AuthService) {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cancelClick(): void {
    this.dialogRef.close();
  }

  searchClick() {
    this.findContracts(this.buildContractRequest(), this.pageSize, this.pageIndex);
  }

  closeClick() {
    this.dialogRef.close();
  }

  hasAddB2BContractRole() {
    return this.authService.hasAddB2BContract();
  }

  addClickTable(element) {
    this.clientService.getContractCount(this.dialogData.profileId, element).subscribe({
      next: data => {
        if (data.count > 0) {
          this.snackbar.open('Данный контракт уже существует у клиента', 'OK');
        } else {
          this.addContractToSelectedContracts(element);
        }
      },
      error: err => {
        console.log(err);
        this.snackbar.open('Ошибка получения количества контрактов', 'OK');
      }
    });
  }

  addContractToSelectedContracts(contract) {
    let clientType;

    this.clientService.getClientType(contract.bercutClientId).subscribe({
      next: data => {
        clientType = data;
        if (clientType.clientId === 1 || 5) {
          this.selectedContracts.push(contract);
          this.snackbar.open(`Выбран контракт:\n ${Utils.jsonPretty(this.selectedContracts)}`, 'OK');
        }
      },
      error: (err) => {
        console.log(err.message);
        this.snackbar.open('Ошибка получения типа клиента', 'OK');

      }
    });
  }

  addClick() {
    const contracts: ClientContract [] = [];
    this.selectedContracts.forEach(item => {
      contracts.push(new ClientContract(item.bercutClientId,
        item.bin,
        item.payAccount,
        null,
        item.contractNum,
        this.dialogData.profileId));
    });
    this.contractsService.addContract(new AddContractParams(this.dialogData.profileId, contracts)).subscribe({
      next: () => {
      },
      error: err => {
        console.log(err);
        this.snackbar.open('Ошибка при добавлении контракта', 'OK');
      },
      complete: () => {
        this.dialogRef.close();
      }
    });
  }

  buildContractRequest(): FindContractRequest {
    const request = new FindContractRequest();
    switch (this.radioOption) {
      case 'payAccount':
        request.iban = this.searchInputFormControl.value;
        break;
      case 'bin':
        request.bin = this.searchInputFormControl.value;
        break;
      case 'title':
        request.title = this.searchInputFormControl.value;
        break;
      case 'msisdn':
        request.msisdn = this.searchInputFormControl.value;
        break;
      case 'account':
        request.account = this.searchInputFormControl.value;
        break;
      case 'contractNum':
        request.contractNum = this.searchInputFormControl.value;
        break;
    }

    return request;
  }

  pageChanged(event: PageEvent) {
    this.contractsService.findContractsPageable(this.buildContractRequest(), event.pageSize, event.pageIndex);
  }

  findContracts(request: FindContractRequest, pageSize: number, pageIndex: number) {
    this.contractsService.findContractsPageable(request, pageSize, pageIndex).subscribe({
      next: data => {
        const contracts: Contract [] = [];
        for (const item of data.content) {
          contracts.push(new Contract(item.clientId,
            item.contractNum,
            item.name,
            item.inn,
            item.rs));
        }
        this.dataSource.data = contracts;
        setTimeout(() => {
          this.paginator.length = data.totalElements;
        });

      },
      error: err => {

      },
      complete: () => {

      }
    });
  }

  deleteClick(element) {
    const data = this.dataSource.data;
    data.forEach((value, index) => {
      if (value.bercutClientId === element.bercutClientId) {
        data.splice(index, 1);
      }
    });
    this.dataSource.data = data;
  }
}
