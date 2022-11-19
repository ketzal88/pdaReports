import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { tokenExpired } from '../utils/token.util';
import { ErrorManagerService } from '../services/errorManager.service';
import { ErrorMessage, ErrorAction } from '../models/errorMessage.model';
import { CookieStorageService } from '../services/cookie-storage.service';
import { DislayType } from '../../shared/components/display-message/displayMessage.interface';

@Injectable()
export class TokenValidationInterceptor implements HttpInterceptor {
  constructor(
    private cookieStorageService: CookieStorageService,
    private errorManager: ErrorManagerService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //TODO - Jordy: Verificar si corresponde agregar esta validacion solamente para los templates .json
    if (req.url.includes('.json')) {
      return next.handle(req);
    }

    const anonnymusLink =
      req.url.toUpperCase().indexOf('LOGIN') !== -1 ||
      req.url.toUpperCase().indexOf('FORGOTPASSWORD') !== -1 ||
      req.url.toUpperCase().indexOf('RECOVERYPASSWORD') !== -1;

    //let loginUrlIndex = req.url.toUpperCase().indexOf('LOGIN');
    let token = this.cookieStorageService.getCookie('JWTToken');

    if (!token && !anonnymusLink) {
      this.unauthorizedExpiredToken('token not found/expired');
      return throwError(() => new Error('token not found/expired'));
    }

    //TODO: Analizar - Nunca entra porque si se expira, desaparece la cookie directamente
    if (token && tokenExpired(token) && !anonnymusLink) {
      this.unauthorizedExpiredToken('token is expired');
      return throwError(() => new Error('token is expired'));
    }

    return next.handle(req).pipe(
      catchError(
        err =>
          new Observable<HttpEvent<any>>(observer => {
            if (err instanceof HttpErrorResponse) {
              const errResp = <HttpErrorResponse>err;
              if (
                //(errResp.status === 403 || ) --Otros servicios devuelven 403
                errResp.status === 401 &&
                !anonnymusLink
              ) {
                this.unauthorizedExpiredToken('token is invalid');
              }
            }
            observer.error(err);
            observer.complete();
          })
      )
    );
  }

  unauthorizedExpiredToken(reason: string): any {
    //TODO: Investigar si es necesario usar un handler./ Devolver el error.
    const errorMessage = 'Unauthorized, ' + reason;
    const error: ErrorMessage = {
      title: errorMessage,
      description: reason,
      type: DislayType.POPUP,
      action: ErrorAction.LOGOUT,
    };

    this.errorManager.addErrors([error]);
  }
}
