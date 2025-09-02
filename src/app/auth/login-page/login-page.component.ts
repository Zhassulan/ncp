import {AfterViewInit, Component, inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DlgLoginComponent} from '../login/dlg-login.component';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {navpath} from '../../settings';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements AfterViewInit {

  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  ngAfterViewInit(): void {
    if (!this.authService.isLogged()) {
      this.dialog.open(DlgLoginComponent, {
        width: '20%',
        height: '35%',
        disableClose: true
      });
    } else {

      this.router.navigate([navpath.payments]);
    }
  }
}
