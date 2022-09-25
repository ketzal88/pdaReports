import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

export class DisplayMessage {
  title?: string;
  buttonText?: string;
  type: DislayType;

  constructor(title: string, buttonText: string = 'Aceptar') {
    this.title = title;
    this.buttonText = buttonText;
  }
}

export enum DislayType {
  POPUP = 'PopUp',
  SNACKBAR = 'Snackbar',
}

export class PopUpMessage extends DisplayMessage {
  override type = DislayType.POPUP;

  description?: string | string[];
  introduction?: string;
  imageUrl?: string;

  width?: string;
  closableOnlyWithButton?: boolean;
  disableClose?: boolean;
  closeOnNavigation?: boolean; //If going back in history, wont dissapear.
  hasBackdrop?: boolean; //Background enabled
  backdropClass?: string; // Background class
}

export class SnackBarMessage extends DisplayMessage {
  override type = DislayType.SNACKBAR;

  //the ideal line length for text is typically between 40-60 characters.
  duration?: number;
  panelClass?: string | string[];
  verticalPosition?: MatSnackBarVerticalPosition;
  horizontalPosition?: MatSnackBarHorizontalPosition;
}
