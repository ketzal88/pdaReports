import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { IdentityService } from '../services/microservices/identity/identity.service';
import { LoginRequest } from '../services/microservices/identity/interfaces/dto/identity-dto.interface';
import { StoreService } from '../services/store.service';
import { StoreKeys } from '../consts/store-keys.enum';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthEnableAnonymousGuard implements CanActivate {
  anonymousUser = environment.anonymousUser;
  constructor(
    private router: Router,
    private identityService: IdentityService,
    private storeService: StoreService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (route.params['id'] !== null) {
      const id: string = route.params['id'].trim();
      //22 (ShortId) -- 36 (Complete GUID ID)
      if (id.length === 22 || id.length === 36) {
        if (this.storeService.getData(StoreKeys.USER_IS_ANONYMOUS) === false) {
          return true;
        }
        const loginRequest: LoginRequest = {
          username: this.anonymousUser.name,
          password: this.anonymousUser.password,
        };

        return firstValueFrom(this.identityService.loginUser(loginRequest));
      }
    }
    this.router.navigate(['/nopage']);
    return false;
  }
}
