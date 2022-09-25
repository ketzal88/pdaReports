import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReportResponseType } from '../../../../core/consts/report-response-type.enum';

@Component({
  selector: 'app-response-dialog',
  templateUrl: './response-dialog.component.html',
  styleUrls: ['./response-dialog.component.scss'],
})
export class ResponseDialogComponent implements OnInit {
  reportResponseType = ReportResponseType;

  constructor(
    public dialogRef: MatDialogRef<ResponseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  closePopUp(): void {
    this.cancel();
  }

  cancel(): void {
    this.close(false);
  }
  close(value: any): void {
    this.dialogRef.close(value);
  }
  confirm(): void {
    this.close(true);
  }
}
