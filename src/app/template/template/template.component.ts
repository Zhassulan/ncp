import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Template} from '../model/template';
import {ActivatedRoute, Router} from '@angular/router';
import {TemplateService} from '../template.service';
import {ClientService} from '../../clients/client.service';
import {TemplateDetailsTableComponent} from '../details-table/template-details-table.component';
import {MatDialog} from '@angular/material/dialog';
import {DlgTemplateDetailComponent} from '../dlg-template-detail/dlg-template-detail.component';
import {TemplateDetail} from '../model/template-detail';
import {PaymentService} from '../../payment/payment.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';


@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
  imports: [MatIconButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem, MatFormField, MatLabel, MatInput,
    TemplateDetailsTableComponent]
})
export class TemplateComponent implements OnInit {

  template: Template;
  profile;
  @ViewChild(TemplateDetailsTableComponent)
  private details: TemplateDetailsTableComponent;
  @Output() emitterClose = new EventEmitter<boolean>();

  constructor(private route: ActivatedRoute,
              private templateService: TemplateService,
              private clntService: ClientService,
              public dialog: MatDialog,
              private router: Router,
              private paymentService: PaymentService,
              private snackbar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.loadTemplate();
  }

  loadTemplate() {
    this.templateService.findById(this.route.snapshot.params['id']).subscribe(
      data => {
        this.template = data;
        if (this.details) {
          this.details.dataSource.data = this.template.details;
        }
        this.clntService.getClientProfileById(this.template.profileId).subscribe({
          next: data1 => this.profile = data1,
          error: err => {
            console.log(err);
            this.snackbar.open('Ошибка получения профиля клиента');
          }
        });
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.details.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.details.dataSource.paginator) {
      this.details.dataSource.paginator.firstPage();
    }
  }

  deleteDetail() {
    if (this.details.selection.selected.length === 0) {
      this.snackbar.open('Выделите записи в таблице', 'OK');
    } else {
      this.details.selection.selected.forEach(t => {

        this.templateService.deleteDetail(this.template.id, t.id).subscribe(
          data => {
            this.loadTemplate();
          },
          error => {
            console.log(error);

            this.snackbar.open('Ошибка удаления регистра', 'OK');
          },
          () => {

            this.details.selection.deselect(t);
          });
      });
    }
  }

  onReload(reload: boolean) {
    if (reload) {
      this.loadTemplate();
    }
  }

  onDeleteDetail() {
    this.deleteDetail();
  }

  onAddDetail() {
    this.openDlgAddTemplateDetail();
  }

  openDlgAddTemplateDetail(): void {
    const dialogRef = this.dialog.open(DlgTemplateDetailComponent, {
      width: '500px',
      data: {detail: new TemplateDetail(null, 0, 0)},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.addDetail(result);
    });
  }

  onApplyPayment() {
    this.paymentService.templateId = this.route.snapshot.params['id'];
    this.router.navigate([`payments/${this.paymentService.payment.id}`]);
  }

  addDetail(detail) {
    const newDetail = new TemplateDetail(
      detail.msisdn,
      Number(detail.account),
      Number(detail.sum));
    this.templateService.createDetail(this.template.id, newDetail).subscribe({
      next: data => this.loadTemplate()
    });
  }
}

