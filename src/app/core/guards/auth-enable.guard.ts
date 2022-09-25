import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { StoreKeys } from '../consts/store-keys.enum';
import { CookieStorageService } from '../services/cookie-storage.service';
import { StoreService } from '../services/store.service';

@Injectable({
  providedIn: 'root',
})
export class AuthEnableGuard implements CanActivate {
  constructor(
    private router: Router,
    private cookieStoreService: CookieStorageService,
    private storeService: StoreService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const tokenCookieStorageValue =
      this.cookieStoreService.getCookie('JWTToken');

    if (tokenCookieStorageValue) {
      const anonymous: boolean = this.storeService.getData(
        StoreKeys.USER_IS_ANONYMOUS
      );
      if (!anonymous) {
        return true;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}
