import {
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
  selector: 'app-pop-up',
  templateUrl: './popUp.component.html',
  styles: [
    `
      .header,
      .dialog-message {
        text-transform: lowercase;
      }
      .header::first-letter,
      .dialog-message::first-letter {
        text-transform: uppercase;
      }
      .btn-cancel {
        background-color: red;
        color: #fff;
      }
    `,
  ],
  // styleUrls: ['./popUp.component.scss'],
})
export class PopUpComponent implements OnInit {
  isArray: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<PopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PopUpMessage
  ) {}

  @Output() closedButton = new EventEmitter();

  ngOnInit(): void {
    this.isArray = Array.isArray(this.data.description);
  }

  closePopUp(): void {
    this.cancel();
    this.closedButton.emit();
  }

  cancel(): void {
    this.close(false);
  }
  close(value): void {
    this.dialogRef.close(value);
  }
  confirm(): void {
    this.close(true);
  }
}
