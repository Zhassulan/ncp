import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, switchMap, throwError} from 'rxjs';
import {AuthService} from './auth.service';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {navpath} from '../settings';

@Injectable({providedIn: 'any'})
export class GlobalHttpInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authService.isLogged()) {
      req = this.setHeader(req);
    }

    return next.handle(req)
      .pipe(
        catchError(error => {

          if (error.status === 403) {
            return this.handle403Error(req, next, error);
          }

          return throwError(error);
        }));
  }

  setHeader(req) {
    if (req.url.includes('/limits')) {
      return req.clone({
        setHeaders: {
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer ' + this.authService.getToken()
        }
      });
    }

    return req.clone({
      setHeaders: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    });
  }

  private handle403Error(req: HttpRequest<any>, next: HttpHandler, err) {
    const token = this.authService.getRefreshToken();
    console.log(`Refreshing token for user ${this.authService.getUserDetails().username} at ${new Date()}`);

    return this.authService.refreshToken(token).pipe(
      switchMap((refreshedToken: any) => {
        console.log(`Got new token for user ${this.authService.getUserDetails().username} at ${new Date()}`);
        this.authService.setUserData(refreshedToken);
        req = this.setHeader(req);

        return next.handle(req);
      }),
      catchError((err1) => {
        if (err1.status === 452 || err1.status === 454) {
          this.authService.logout();
          this.router.navigate([navpath.login]);
        }

        return throwError(err1);
      })
    );

    return next.handle(req);
  }
}
