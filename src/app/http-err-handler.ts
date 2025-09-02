import {throwError} from 'rxjs';

export class HttpErrHandler {

  static handleError(error: any) {

    return throwError(error);
  }
}
