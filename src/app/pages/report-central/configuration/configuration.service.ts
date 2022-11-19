import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LocalStepModel } from './interfaces/local-step-model.interface';
import { GeneratedReportByIdResponse } from 'src/app/core/services/microservices/reports/interfaces/generatedReportsResponse.interface';
import {
  ItemStepConfiguration,
  StepConfigurationResponse,
} from '../../../core/services/microservices/reports/interfaces/configuration-report.interface';
import { MyReport } from './interfaces/myReport.interface';
import { areObjEquals } from '../../../shared/utils/objects.util';
import { ModalService } from '../../../core/services/modal.service';
import { ResponseDialogComponent } from '../../../shared/components/modal/response-dialog/response-dialog.component';
import { ReportResponseType } from '../../../core/consts/report-response-type.enum';
import { Router } from '@angular/router';

@Injectable()
export class ConfigurationService {
  private resetConfigurationErrorEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  private resetConfigurationWarningEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  constructor(private modalService: ModalService, private router: Router) {}

  getConfigurationStepMapping(
    selectedStepConfiguration: StepConfigurationResponse
  ): LocalStepModel[] {
    let steps: LocalStepModel[] = selectedStepConfiguration?.steps.reduce(
      (
        accumulator: LocalStepModel[],
        currentValue: ItemStepConfiguration,
        idx: number
      ) => {
        accumulator.push({
          stepName: currentValue.name,
          stepIndex: idx,
          isComplete: currentValue.step.isComplete,
          isEnabled: currentValue.step.isEnabled,
        });
        idx++;
        return accumulator;
      },
      []
    );
    return steps;
  }

  reportGeneratedAreEquals(
    compareWithTemplate: boolean,
    generatedReportByIdResponseTemplate: GeneratedReportByIdResponse,
    generatedReportByIdResponse: GeneratedReportByIdResponse,
    myReportSaved: MyReport
  ): boolean {
    const toCompare = compareWithTemplate
      ? generatedReportByIdResponseTemplate
      : generatedReportByIdResponse;

    let objByReport: any = {
      individualId: myReportSaved.individualIds
        ? myReportSaved.individualIds[0]
        : null,
      areaId: myReportSaved.areaId ? myReportSaved.areaId : null,
      groupId: myReportSaved.groupId ? myReportSaved.groupId : null,
      leaderIndividualId: myReportSaved.leaderIndividualId
        ? myReportSaved.leaderIndividualId
        : null,
      feedbackText: myReportSaved.feedbackText
        ? myReportSaved.feedbackText
        : null,
    };

    let objByGeneratedReport: any = {
      individualId: toCompare.individualId,
      areaId: toCompare.areaId,
      groupId: toCompare.groupId,
      leaderIndividualId: toCompare.leaderIndividualId,
      feedbackText: toCompare.feedbackText,
    };

    if (compareWithTemplate) {
      objByGeneratedReport.individualId = null;
      objByReport.individualId = null;
    }

    if (
      objByReport.individualId &&
      objByReport.areaId &&
      objByReport.groupId &&
      objByReport.leaderIndividualId &&
      objByReport.feedbackText
    ) {
      return areObjEquals(objByReport, objByGeneratedReport);
    } else {
      return true;
    }
  }

  setSuccess(resultError: string[], type: string, panelClass: string): void {
    this.modalService.openPopUp(
      ResponseDialogComponent,
      this.modalService.getParams(resultError, type, panelClass)
    );

    this.modalService.confirmedPopUp().subscribe(() => {});
  }

  setError(message: string[], type: string): void {
    this.modalService.openPopUp(
      ResponseDialogComponent,
      this.modalService.getParams(message, type, 'response-error')
    );

    let timer = setInterval(() => {
      clearInterval(timer);
      timer = null;
      this.resetConfigurationErrorEvent.emit(true);
      this.modalService.dialogRef.close(true);
    }, 3000);

    this.modalService.confirmedPopUp().subscribe(() => {
      if (timer) {
        clearInterval(timer);
        this.resetConfigurationErrorEvent.emit(true);
      }
    });
  }
  setWarning(resultError: string[], type: string, panelClass: string): void {
    this.modalService.openPopUp(
      ResponseDialogComponent,
      this.modalService.getParams(resultError, type, panelClass)
    );

    let timer = setInterval(() => {
      clearInterval(timer);
      timer = null;
      this.modalService.dialogRef.close(true);
    }, 3000);

    this.modalService.confirmedPopUp().subscribe(() => {
      if (timer) {
        clearInterval(timer);
      }
      this.resetConfigurationWarningEvent.emit(true);
    });
  }

  getResetConfigurationErrorEvent(): EventEmitter<boolean> {
    return this.resetConfigurationErrorEvent;
  }

  getResetConfigurationWarningEvent(): EventEmitter<boolean> {
    return this.resetConfigurationWarningEvent;
  }
}
