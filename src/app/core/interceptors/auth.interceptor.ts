import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { CookieStorageService } from '../services/cookie-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private localStorage: LocalStorageService,
    private cookieStorageService: CookieStorageService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = this.cookieStorageService.getCookie('JWTToken');
    const language = this.localStorage.getValue('language');

    if (!token) {
      return next.handle(request);
    }

    let httpRequestWithHeaders: HttpRequest<any>;
    if (request.headers.has('UndefinedContentType')) {
      httpRequestWithHeaders = request.clone({
        headers: request.headers
          .set('Authorization', `Bearer ${token}`)
          .set('Accept-Language', `${language}`),
      });
    } else {
      httpRequestWithHeaders = request.clone({
        headers: request.headers
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .set('Accept-Language', `${language}`),
      });
    }

    //es-AR, en-US
    return next.handle(httpRequestWithHeaders);
  }
}
