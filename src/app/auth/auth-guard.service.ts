import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from './auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable} from 'rxjs';
import {navpath} from '../settings';

@Injectable({providedIn: 'any'})
export class AuthGuard {

  private readonly snackbar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    const b = this.authService.isLogged();
    const b1 = this.authService.hasCommonAccess();

    console.log(`Is user logged in ${b}`);
    console.log(`Is user has common access ${b1}`);

    if (!this.authService.isLogged()) {

      return this.router.navigateByUrl(navpath.login);
    }

    if (this.authService.isLogged() && this.authService.hasCommonAccess()) {

      return true;
    }

    this.snackbar.open('У вас нет доступа к NCP', 'OK');

    return false;
  }
}
