import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { take, map, Observable } from 'rxjs';
import { PopUpComponent } from 'src/app/shared/components/display-message/pop-up/popUp.component';
import { ShowMoreComponent } from '../../shared/components/display-message/showMore/showMore.component';
import {
  PopUpMessage,
  SnackBarMessage,
} from '../../shared/components/display-message/displayMessage.interface';

@Injectable({
  providedIn: 'root',
})
export class DisplayMessageService {
  dialogRef: MatDialogRef<PopUpComponent>;
  showMoreRef: MatDialogRef<ShowMoreComponent>;

  constructor(private snackBar: MatSnackBar, private matDialog: MatDialog) {}
  // Observable string stream
  //private dataSetChangeSource = new Subject<string>();

  openSnackBar(message: SnackBarMessage): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(
      message.title,
      message.buttonText ? message.buttonText : 'Aceptar',
      {
        duration: message.duration ? message.duration * 1000 : undefined,
        panelClass: message.panelClass
          ? message.panelClass
          : 'white-background',
        verticalPosition: message.verticalPosition,
        horizontalPosition: message.horizontalPosition,
        data: message,
      }
    );
  }

  openPopUp(message: PopUpMessage): MatDialogRef<PopUpComponent, any> {
    const params = {
      width: message.width ? message.width : 'auto',
      hasBackdrop:
        message.hasBackdrop !== undefined ? message.hasBackdrop : true,
      backdropClass: message.backdropClass,
      closeOnNavigation:
        message.closeOnNavigation !== undefined
          ? message.closeOnNavigation
          : true,
      disableClose:
        message.disableClose !== undefined ? message.disableClose : false,
      data: message,
    };
    this.dialogRef = this.matDialog.open(PopUpComponent, params);
    return this.dialogRef;
  }

  openShowMoreModal(
    message: PopUpMessage
  ): MatDialogRef<ShowMoreComponent, any> {
    const params = {
      width: message.width ? message.width : 'auto',
      hasBackdrop:
        message.hasBackdrop !== undefined ? message.hasBackdrop : true,
      backdropClass: message.backdropClass,
      closeOnNavigation:
        message.closeOnNavigation !== undefined
          ? message.closeOnNavigation
          : true,
      disableClose:
        message.disableClose !== undefined ? message.disableClose : false,
      data: message,
    };
    this.showMoreRef = this.matDialog.open(ShowMoreComponent, params);
    return this.showMoreRef;
  }

  confirmedShowMoreModal(): Observable<any> {
    return this.showMoreRef.afterClosed().pipe(
      take(1),
      map(res => {
        return res;
      })
    );
  }

  confirmedPopUp(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(
      take(1),
      map(res => {
        return res;
      })
    );
  }
}
