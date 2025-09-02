import {AfterViewInit, Component, inject} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {ClientsListComponent} from '../clients/list/clients-list.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {navpath} from '../settings';

@Component({
  selector: 'app-mobipay',
  templateUrl: './mobipay.component.html',
  imports: [
    ClientsListComponent
  ],
  styleUrls: ['./mobipay.component.scss']
})
export class MobipayComponent implements AfterViewInit {

  readonly snackbar = inject(MatSnackBar);
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  ngAfterViewInit(): void {
    if (!this.authService.hasMobipayRole()) {
      this.snackbar.open('У вас нет доступа к мобипей платежам', 'OK');
      this.router.navigate([navpath.payments]);
    }
  }
}
