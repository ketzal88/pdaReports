import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReportResponseType } from 'src/app/core/consts/report-response-type.enum';
import { DuplicateReportGeneratedResponse } from 'src/app/core/services/microservices/reports/interfaces/duplicateReportGenerated.interface';
import { ReportLinkPipe } from 'src/app/shared/pipes/report-link.pipe';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-multiple-report-response-dialog',
  templateUrl: './multiple-report-response-dialog.component.html',
  styleUrls: ['./multiple-report-response-dialog.component.scss'],
})
export class MultipleReportResponseDialogComponent implements OnInit {
  reportResponseType = ReportResponseType;
  multipleReportGeneratedResponse: DuplicateReportGeneratedResponse[];
  anyError: boolean = false;

  displayedColumns: string[] = ['status', 'individualName', 'result'];

  constructor(
    public dialogRef: MatDialogRef<MultipleReportResponseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clipboard: Clipboard,
    private reportLinkPipe: ReportLinkPipe
  ) {
    this.multipleReportGeneratedResponse = data.multipleReportGeneratedResponse;
    if (this.multipleReportGeneratedResponse) {
      this.anyError =
        this.multipleReportGeneratedResponse.findIndex(x => !x.ok) !== -1;
    }
  }

  copyLinkToClipboard(text: any): void {
    const reportLink = this.reportLinkPipe.transform(text);
    this.clipboard.copy(reportLink);
  }

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
