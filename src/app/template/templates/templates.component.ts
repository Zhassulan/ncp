import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TemplateService} from '../template.service';
import {ClientService} from '../../clients/client.service';
import {TemplatesTableComponent} from '../templates-table/templates-table.component';
import {MatDialog} from '@angular/material/dialog';
import {DlgEnterTemplateName} from '../dlg/enter-template-name/dlg-enter-template-name.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
  imports: [MatIconButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem, MatFormField, MatLabel, MatInput,
    TemplatesTableComponent]
})
export class TemplatesComponent implements OnInit {

  @ViewChild(TemplatesTableComponent) templatesTableComponent;
  profile;

  constructor(private route: ActivatedRoute,
              private clntService: ClientService,
              private templateService: TemplateService,
              private router: Router,
              public dialog: MatDialog,
              private snackbar: MatSnackBar) {
  }


  ngOnInit(): void {
    this.loadProfile(this.route.snapshot.params['id']);
  }

  loadProfile(profileId) {
    this.clntService.getClientProfileById(profileId).subscribe({
      next: value => this.profile = value,
      error: err => {
        console.log(err);
        this.snackbar.open('Ошибка получения профиля клиента', 'OK');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.templatesTableComponent.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.templatesTableComponent.dataSource.paginator) {
      this.templatesTableComponent.dataSource.paginator.firstPage();
    }
  }

  onDelete() {
    this.delete();
  }

  delete() {
    if (this.templatesTableComponent.selection.selected.length === 0) {
      this.snackbar.open('Выделите записи в таблице', 'OK');
    } else {
      this.templatesTableComponent.selection.selected.forEach(t => {
        this.templateService.delete(t.id).subscribe({
          next: value => this.templatesTableComponent.retrieve(),
          error: err => {
            console.log(err);
            this.snackbar.open('Ошибка удаления шаблона', 'OK');
          }
        });
      });
    }
  }

  onCreate() {
    this.openDlgEnterTemplateName();
  }

  openDlgEnterTemplateName(): void {
    const dialogRef = this.dialog.open(DlgEnterTemplateName, {
      width: '250px',
      data: {name: ''},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.createTemplate(this.profile.id, result);
    });
  }

  createTemplate(profileId, name) {
    this.templateService.create(profileId, name).subscribe({
      next: value => this.router.navigate([`templates/${value.id}`]),
      error: err => {
        console.log(err);
        this.snackbar.open('Ошибка создания шаблона', 'OK');
      }
    });
  }
}
