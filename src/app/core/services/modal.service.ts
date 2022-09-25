import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, take, map } from 'rxjs';

@Injectable()
export class ModalService {
  dialogRef: MatDialogRef<any>;

  constructor(private dialog: MatDialog) {}

  openPopUp(modalComponent: any, params?: any): void {
    this.dialogRef = this.dialog.open(modalComponent, params);
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
