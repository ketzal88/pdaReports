import { Injectable } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { LoginResponse } from '../services/microservices/identity/interfaces/dto/identity-dto.interface';
import { CookieStorageService } from '../services/cookie-storage.service';
import { LanguageService } from '../services/language.service';
import { environment } from 'src/environments/environment';
import { StoreService } from '../services/store.service';
import { StoreKeys } from '../consts/store-keys.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  pathRole: string = environment.pathRole;

  constructor(
    private localStorage: LocalStorageService,
    private storeService: StoreService,
    private cookieStorageService: CookieStorageService,
    private languageService: LanguageService
  ) {}

  logOut(): void {
    this.localStorage.clearAllLocalStorage();
    this.cookieStorageService.deleteCookie('JWTToken');
    this.storeService.clearAll();
  }

  setToken(loginResponse: LoginResponse): void {
    this.localStorage.setValue('language', 'es-AR');

    if (this.languageService.getLanguageCurrent() !== 'es-AR') {
      this.languageService.changeLanguage('es-AR');
    }

    this.storeService.setData(
      'userDetails',
      JSON.stringify(loginResponse.userDetails)
    );

    let userRoles: string[] = JSON.parse(
      window.atob(loginResponse.token.split('.')[1])
    )[this.pathRole];
    userRoles = !userRoles ? [''] : userRoles;
    this.storeService.setData(StoreKeys.USER_ROLES, userRoles);

    const isAnonymous: boolean = userRoles.indexOf('anonymous') !== -1;
    this.storeService.setData(StoreKeys.USER_IS_ANONYMOUS, isAnonymous);

    this.cookieStorageService.setCookie({
      name: 'JWTToken',
      value: loginResponse.token,
      secure: true,
      domain: environment.cookieDomain,
      expireMinutes: Number(loginResponse.expirationMinutes),
    });
  }
}
