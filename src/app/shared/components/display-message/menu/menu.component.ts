import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopUpMessage } from '../displayMessage.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, AfterViewInit {
  isArray: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<MenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PopUpMessage
  ) {}

  @Output() closedButton = new EventEmitter();

  ngOnInit(): void {
    this.isArray = Array.isArray(this.data?.description);
  }

  ngAfterViewInit(): void {
    document
      .getElementsByClassName('mat-dialog-container')[0]
      .classList.add('menu-modal-panel');
  }

  closeMenu(): void {
    document
      .getElementsByClassName('mat-dialog-container')[0]
      .classList.remove('menu-modal-panel');
    this.cancel();
    this.closedButton.emit();
  }

  cancel(): void {
    document
      .getElementsByClassName('mat-dialog-container')[0]
      .classList.remove('menu-modal-panel');
    this.close(false);
  }

  close(value): void {
    document
      .getElementsByClassName('mat-dialog-container')[0]
      .classList.remove('menu-modal-panel');
    this.dialogRef.close(value);
  }

  confirm(): void {
    document
      .getElementsByClassName('mat-dialog-container')[0]
      .classList.remove('menu-modal-panel');
    this.close(true);
  }
}
