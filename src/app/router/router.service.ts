import {Injectable} from '@angular/core';
import {RouterRegistry} from './model/router-registry';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {httpHeaders} from '../settings';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'any'
})
export class RouterService {

  routerRegistry: RouterRegistry;

  constructor(private snackbar: MatSnackBar,
              private http: HttpClient) {
  }

  registryFromFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return new Observable(
      observer => {
        this.getRouterRegistry(formData).subscribe({
          next: data => {
            this.routerRegistry = data;
            observer.next(true);
          },
          error: error => {
            this.snackbar.open(error.message, 'OK');
            observer.error(false);
          },
          complete: () => {
            observer.complete();
          }
        });
      }
    );
  }

  resetFilePayment() {
    this.routerRegistry = null;
  }

  getItems() {
    return this.routerRegistry.items;
  }

  private getRouterRegistry(formData: FormData) {
    return this.http.post<RouterRegistry>(`${API_URL}/payments/router/registry`, formData, {headers: httpHeaders});
  }
}
