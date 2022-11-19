import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogModel } from 'src/app/shared/components/individuals/modal/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss'],
})
export class InputDialogComponent implements OnInit {
  title: string;
  message: string;
  inputText: string = '';

  constructor(
    public dialogRef: MatDialogRef<InputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel
  ) {
    this.title = data.title;
    this.message = data.message;
    if (data.inputText) {
      this.inputText = data.inputText;
    }
  }
  ngOnInit(): void {}
  onCommand(): void {
    this.dialogRef.close(this.inputText);
  }
  onClose(): void {
    this.dialogRef.close();
  }
}
