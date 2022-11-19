import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs/internal/Subject';
import { ErrorManagerService } from './core/services/errorManager.service';
import { takeUntil } from 'rxjs/operators';
import { LanguageService } from './core/services/language.service';
import { DisplayMessageService } from './core/services/displayMessage.service';
import {
  DislayType,
  PopUpMessage,
  SnackBarMessage,
} from './shared/components/display-message/displayMessage.interface';
import { ErrorAction } from './core/models/errorMessage.model';
import { ReportsEventService } from './pages/reports/reports-event.service';
import { ReportEvent } from './core/consts/report-event.enum';
import { StoreKeys } from './core/consts/store-keys.enum';
import { StoreService } from './core/services/store.service';
import { CookieStorageService } from './core/services/cookie-storage.service';
import { environment } from '../environments/environment';
import 'tippy.js/dist/tippy.css';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  pathRole: string = environment.pathRole;
  title = 'pda';
  private ngUnsubscribe = new Subject();
  constructor(
    private errorManager: ErrorManagerService,
    public matDialog: MatDialog,
    private languageService: LanguageService,
    private displayMessageService: DisplayMessageService,
    private reportsEventService: ReportsEventService,
    private storeService: StoreService,
    private cookieStorageService: CookieStorageService
  ) {
    this.languageService.setDefaultLanguage();
  }

  ngOnInit(): void {
    this.initializeErrors();

    const cookieJWT = this.cookieStorageService.getCookie('JWTToken');
    if (cookieJWT) {
      this.saveUserRoles(cookieJWT);
    }
  }

  saveUserRoles(jwt: string): void {
    const userRoles: string[] = JSON.parse(window.atob(jwt.split('.')[1]))[
      this.pathRole
    ];
    this.storeService.setData(StoreKeys.USER_ROLES, userRoles);

    const isAnonymous: boolean = userRoles?.indexOf('anonymous') !== -1;
    this.storeService.setData(StoreKeys.USER_IS_ANONYMOUS, isAnonymous);
  }

  private initializeErrors(): void {
    this.errorManager
      .getErrors()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(errors => {
        const parameters = this.errorManager.getDisplayMessage(errors[0]);

        if (parameters.type === DislayType.POPUP) {
          this.managePopUpError(parameters, errors[0].action);
        } else if (parameters.type === DislayType.SNACKBAR) {
          this.manageSnackBarError(parameters, errors[0].action);
        }
      });
  }

  managePopUpError(parameters: PopUpMessage, errorAction: ErrorAction): void {
    const dialogRef = this.displayMessageService.openPopUp(parameters);
    //If its only allowed to close it with a button,this suscribes to it, to execute the post acceptance action.
    if (parameters.closableOnlyWithButton) {
      const subscriptionwithButton =
        dialogRef.componentInstance.closedButton.subscribe(() => {
          subscriptionwithButton.unsubscribe();
          this.errorManager.executeAction(errorAction);
          this.reportsEventService.setCurrentReport(ReportEvent.NOT_REPORT);
        });
    } else {
      //After closing, exeutes the post action.
      const subscriptionAfterClosed = dialogRef.afterClosed().subscribe(() => {
        subscriptionAfterClosed.unsubscribe();
        this.errorManager.executeAction(errorAction);
        this.reportsEventService.setCurrentReport(ReportEvent.NOT_REPORT);
      });
    }
  }

  manageSnackBarError(
    parameters: SnackBarMessage,
    errorAction: ErrorAction
  ): void {
    const snackBarRef = this.displayMessageService.openSnackBar(parameters);

    const subscriptionAfterDissmissed = snackBarRef.onAction().subscribe(() => {
      subscriptionAfterDissmissed.unsubscribe();
      this.errorManager.executeAction(errorAction);
    });
  }
}

/*
  validateToken(jwt: string): Promise<boolean> {
    return firstValueFrom(this.identityService.validateToken(jwt));
  }
*/
