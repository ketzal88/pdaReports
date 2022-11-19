import { Injectable } from '@angular/core';
import { ModalService } from '../../../../core/services/modal.service';
import { ResponseDialogComponent } from '../../../../shared/components/modal/response-dialog/response-dialog.component';
import { SendReportResponse } from '../interfaces/send-report-response.interface';
import { SendReportComponent } from './send-report.component';
import { ReportResponseType } from '../../../../core/consts/report-response-type.enum';
import { GeneratedReport } from '../../../../core/services/microservices/reports/interfaces/generatedReportsResponse.interface';
import { SendReportOptions } from '../interfaces/send-report-options.interface';

@Injectable()
export class SendReportService {
  constructor(private modalService: ModalService) {}

  onSendReport(
    selectedClientId: string,
    selectedSubbaseId: string,
    reportList: GeneratedReport[]
  ): void {
    let sendReportOptions: SendReportOptions = {
      baseId: selectedClientId,
      subbaseId: selectedSubbaseId,
      reportList: reportList,
    };
    const params = {
      width: '1000px',
      data: sendReportOptions,
    };
    this.modalService.openPopUp(SendReportComponent, params);
    this.modalService.confirmedPopUp().subscribe((resp: SendReportResponse) => {
      if (resp) {
        if (
          resp.result.some(
            data =>
              resp.emails.includes(data) ||
              reportList.map(data => data.email).includes(data)
          )
        ) {
          this.setWarning(
            ['MY_REPORTS.SEND.WARNING'],
            ReportResponseType.WARNING,
            'response-warning'
          );
        } else {
          this.setSuccess(
            ['MY_REPORTS.SEND.SUCCESS'],
            ReportResponseType.SUCCESS,
            'response-success'
          );
        }
      }
    });
  }

  setSuccess(message: string[], type: string, panelClass: string): void {
    this.loadDataModal(message, type, panelClass);
  }

  setWarning(message: string[], type: string, panelClass: string): void {
    this.loadDataModal(message, type, panelClass);
  }

  loadDataModal(message: string[], type: string, panelClass: string): void {
    this.modalService.openPopUp(
      ResponseDialogComponent,
      this.getParams(message, type, panelClass)
    );

    this.modalService.confirmedPopUp().subscribe((response: any) => {});
  }

  getParams(message: string[], type: string, panelClass: string): any {
    const params = {
      width: '414px',
      data: {
        type,
        message,
      },
      panelClass: panelClass,
    };
    return params;
  }
}
