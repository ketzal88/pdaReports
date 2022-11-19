import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Loader } from 'src/app/core/services/loader/loader';
import { ReportResponseType } from '../../../../core/consts/report-response-type.enum';
import { Subscription } from 'rxjs';
import { ReportsService } from '../../../../core/services/microservices/reports/reports.service';
import { PdaPdfReportGenerationRequest } from 'src/app/core/services/microservices/reports/interfaces/pdaPdfReportGenerationRequest.interface';

@Component({
  selector: 'app-pdf-generation',
  templateUrl: './pdf-generation.component.html',
  styleUrls: ['./pdf-generation.component.scss'],
})
export class PdfGenerationComponent implements OnInit {
  reportResponseType = ReportResponseType;
  reportPDFLoader: Loader;
  reportPDFSub: Subscription;

  //Display props
  url: string;
  success: boolean;

  constructor(
    private reportsService: ReportsService,
    public dialogRef: MatDialogRef<PdfGenerationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.reportPDFLoader = new Loader();
    this.downloadPDF();
  }

  downloadPDF(): void {
    this.reportPDFSub = this.reportPDFLoader
      .load(this.reportsService.getReportPdfUrl(this.getBodyPdfRequest()))
      .subscribe({
        next: (url: string) => {
          this.url = url;
          this.success = true;
          this.data.type = this.reportResponseType.SUCCESS;
          this.data.message = url;
        },
        error: error => {
          this.url = 'Error al generar el PDF';
          this.success = false;
          this.data.type = this.reportResponseType.ERROR;
          this.data.message = 'Error al generar el PDF';
        },
        complete: () => {},
      });
  }
  getBodyPdfRequest(): PdaPdfReportGenerationRequest {
    return {
      reportGeneratedId: this.data.reportGeneratedId,
    };
  }

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
