import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {MatDialogClose, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {Message} from '../../message';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoginRequest} from '../model/login-request';
import {NgClass} from '@angular/common';
import {MatFormField, MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {SpinnerService} from '../../spinner/spinner.service';
import {navpath} from '../../settings';

@Component({
  selector: 'app-login',
  templateUrl: './dlg-login.component.html',
  styleUrls: ['./dlg-login.component.scss'],
  imports: [NgClass, MatDialogTitle, MatFormField, MatInput, FormsModule, MatButton, MatDialogClose]
})

export class DlgLoginComponent implements OnInit {

  userName: string;
  userPassword: string;

  private readonly spinnerService = inject(SpinnerService);

  constructor(public authService: AuthService,
              private router: Router,
              private dialogRef: MatDialogRef<DlgLoginComponent>,
              private snackbar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.userName = this.authService.getUser();
  }

  onEnter() {
    this.login();
  }

  login() {
    if (!(this.userName && this.userPassword)) {
      this.snackbar.open(Message.WAR.ENTER_LOGIN_PASSWORD, 'OK');

      return;
    }

    console.log('Checking creds..');

    this.spinnerService.start();
    this.authService.login(new LoginRequest(this.userName, this.userPassword)).subscribe({
      next: data => {
        this.authService.setUser(this.userName);
        this.authService.setUserData(data);
        this.dialogRef.close();
        console.log('Navigating to payments');
        this.router.navigate([navpath.payments]);
      },
      error: err => {
        this.authService.logout();
        console.log(err);
        this.spinnerService.stop();
        this.snackbar.open('Ошибка входа. Проверьте логин и пароль', 'OK');
      },
      complete: () => this.spinnerService.stop()
    });
  }
}
