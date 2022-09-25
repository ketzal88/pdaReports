import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportsEventService } from './reports/reports-event.service';
import { Observable, Subscription, take, tap } from 'rxjs';
import { unsubscribe } from '../core/utils/subscription.util';
import { ReportEvent } from '../core/consts/report-event.enum';
import {
  UserDetails,
  UsersAccount,
} from '../core/services/microservices/identity/identity.interface';
import { StoreService } from '../core/services/store.service';
import { StoreKeys } from '../core/consts/store-keys.enum';
import { environment } from 'src/environments/environment';
import { CookieStorageService } from '../core/services/cookie-storage.service';
import { decodeToken } from '../core/utils/token.util';
import { IdentityService } from '../core/services/microservices/identity/identity.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit, OnDestroy {
  //Bindings
  isReport$: Observable<ReportEvent>;
  stateReportEvent = ReportEvent;
  private reportsEventSub: Subscription;

  constructor(
    private router: Router,
    private reportsEventService: ReportsEventService,
    private storeService: StoreService,
    private cookieStorageService: CookieStorageService,
    private identityService: IdentityService
  ) {}

  ngOnInit(): void {
    const cookieJWT = this.cookieStorageService.getCookie('JWTToken');
    let tokenData = decodeToken(cookieJWT);
    this.storeService.setData(StoreKeys.USER_USERNAME, tokenData.fullName);
    this.storeService.setData(StoreKeys.USER_ID, tokenData.UserId);

    this.identityService
      .getUsersAccount(tokenData.UserId)
      .pipe(take(1))
      .subscribe((res: UsersAccount[]) => {
        let userDetails: UserDetails = {
          usersAccounts: res,
          userId: tokenData.UserId,
          userName: tokenData.fullName,
        };
        this.storeService.setData('userDetails', JSON.stringify(userDetails));
      });

    this.callEventReports();
    if (this.router.url.includes('/app?')) {
      this.router.navigate(['/app']);
    }
  }

  ngOnDestroy(): void {
    unsubscribe(this.reportsEventSub);
  }

  callEventReports(): void {
    this.isReport$ = this.reportsEventService.getCurrentReport();
  }
}
