import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs';
import { ErrorAction, ErrorMessage } from '../models/errorMessage.model';
import { Router } from '@angular/router';
import { DislayType } from 'src/app/shared/components/display-message/displayMessage.interface';
import { AuthenticationService } from '../authentication/authentication.service';
import {
  PopUpMessage,
  SnackBarMessage,
} from '../../shared/components/display-message/displayMessage.interface';

@Injectable()
export class ErrorManagerService {
  private errors = new Subject<ErrorMessage[]>();
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}
  //TODO: Ver si requerimos realmente usar el [] o lo pasamos a individual.

  addErrors = (errors: ErrorMessage[]): void => this.errors.next(errors);

  getErrors = (): Observable<ErrorMessage[]> => this.errors.asObservable();

  executeAction(action: ErrorAction): void {
    if (action === ErrorAction.LOGOUT) {
      this.authenticationService.logOut();
      this.router.navigate(['/login']);
    }
  }

  getDisplayMessage(error: ErrorMessage): SnackBarMessage | PopUpMessage {
    let ret: SnackBarMessage | PopUpMessage;
    if (error.type === DislayType.POPUP) {
      ret = {
        type: DislayType.POPUP,
        title: error.title,
        description: error.description,
        hasBackdrop: true,
      };

      if (error.action === ErrorAction.LOGOUT) {
        ret.disableClose = true;
        ret.closeOnNavigation = false;
        ret.closableOnlyWithButton = true;
        ret.backdropClass = 'pda-dark-backdrop';
      }
    } else if (error.type === DislayType.SNACKBAR) {
      ret = {
        type: DislayType.SNACKBAR,
        title: error.title,
      };
    }

    return ret;
  }
}
