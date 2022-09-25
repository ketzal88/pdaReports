import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { StepsService } from '../../../core/services/steps.service';
import { StepModel } from '../../../core/models/step.model';
import {
  concat,
  Observable,
  Subscription,
  catchError,
  take,
  combineLatest,
  of,
  timer,
  map,
} from 'rxjs';
import { ReportConfigurationSteps } from '../../../core/configs/report-configuration-steps.config';
import { ConfigurationSteps } from '../../../core/models/configuration-steps.model';
import { SelectedReport } from '../../../core/models/reportType.model';
import { StoreService } from '../../../core/services/store.service';
import { StoreKeys } from '../../../core/consts/store-keys.enum';
import { unsubscribe } from 'src/app/core/utils/subscription.util';
import { MyReport } from './interfaces/myReport.interface';
import { Competency } from 'src/app/core/services/microservices/competency/competency.interface';
import {
  Job,
  JobCategory,
} from 'src/app/core/services/microservices/job/job.interface';
import { VwGetAllIndividualWithBehaviouralProfile } from 'src/app/core/services/microservices/individual/individual.interface';
import { ReportStyles } from './interfaces/reportStyles.interface';
import { configurationSteps } from '../../../core/configs/steps-configuration/steps-configuration.config';
import { TypeFilter } from '../../../shared/components/mat-custom-individuals-table/models/type-filter.interface';
import { GeneratedReportsService } from '../../../core/services/microservices/reports/generated-reports.service';
import {
  ReportGeneratedCompetencyRequest,
  ReportGeneratedJobRequest,
  ReportGeneratedRequest,
} from '../../../core/services/microservices/reports/interfaces/reportGeneratedRequest.interface';
import { CookieStorageService } from '../../../core/services/cookie-storage.service';
import { decodeToken } from '../../../core/utils/token.util';
import { Loader } from '../../../core/services/loader/loader';
import { ReportResponseType } from '../../../core/consts/report-response-type.enum';
import { ModalService } from '../../../core/services/modal.service';
import { ResponseDialogComponent } from '../../../shared/components/modal/response-dialog/response-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { GuidService } from '../../../core/services/guid.service';
import {
  StepConfiguration,
  ItemStepConfiguration,
} from '../../../core/configs/steps-configuration/interfaces/steps-configuration.interface';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  //Bindings
  reportConfigurationSteps: ConfigurationSteps[] = ReportConfigurationSteps;
  selectedReport!: SelectedReport;
  isReportGenerate!: boolean;
  jobsByCategory: Job[];
  jobCategory: JobCategory;
  selectedStepConfiguration: StepConfiguration;
  saveMultipleIndividualsIds: boolean = false;

  currentStep!: StepModel | null;
  currentStepSub!: Subscription;

  myReportSaved: MyReport;

  selectedClientId: string;
  selectedSubbaseId: string;

  typeFilterList: TypeFilter[];

  //Variables
  tokenData: any;
  messageError: string;
  //private counter: Observable<number>;
  //private count: number = 6;

  //Loaders
  generateReportLoader: Loader;
  generateCompetencyByReportLoader: Loader;
  generateJobByReportLoader: Loader;

  //Subscriptions
  generateReportSub: Subscription;
  generateCompetencyByReportSub: Subscription;
  generateJobByReportSub: Subscription;
  generateSetObsSub: Subscription;
  timerSub: Subscription;

  constructor(
    private stepsService: StepsService,
    private router: Router,
    private storeService: StoreService,
    private generatedReporsService: GeneratedReportsService,
    private cookieStorageService: CookieStorageService,
    private modalService: ModalService,
    private translateService: TranslateService,
    private guidService: GuidService
  ) {
    let reportType = this.storeService.getData(StoreKeys.TYPE_REPORT);
    if (!reportType) {
      this.router.navigate(['/app']);
    } else {
      //Obtengo tipo de reporte seleccionado
      this.selectedReport = JSON.parse(reportType);
      this.loadStepConfiguration();
      this.stepsService.initSteps(this.getStepsConfiguration());
      this.myReportSaved = new MyReport();
    }
  }

  ngOnInit(): void {
    this.initLoaders();
    const cookieJWT = this.cookieStorageService.getCookie('JWTToken');
    this.tokenData = decodeToken(cookieJWT);
    this.isReportGenerate = false;
    this.loadCurrentStep();
  }

  ngOnDestroy(): void {
    unsubscribe(this.currentStepSub);
    this.cleanConfigStorage();
  }

  initLoaders(): void {
    this.generateReportLoader = new Loader();
    this.generateCompetencyByReportLoader = new Loader();
    this.generateJobByReportLoader = new Loader();
  }

  loadCurrentStep(): void {
    this.currentStepSub = this.stepsService
      .getCurrentStep()
      .subscribe((step: StepModel) => {
        this.currentStep = step;
      });
  }

  cleanConfigStorage(): void {
    this.storeService.clearValue(StoreKeys.SELECTED_INDIVIDUALS);
    this.storeService.clearValue(StoreKeys.SELECTED_JOB);
    this.storeService.clearValue(StoreKeys.SELECTED_JOB_CATEGORY);
    this.storeService.clearValue(StoreKeys.SELECTED_INDIVIDUALS_BY_GROUP);
  }

  loadStepConfiguration(): void {
    //Obtengo la configuracion por el tipo de reporte
    console.log(this.selectedReport);
    this.selectedStepConfiguration = configurationSteps.find(
      (data: StepConfiguration) =>
        data.groupReport === this.selectedReport?.reportGroup.internalName &&
        data.reportType === this.selectedReport?.reportType.internalName
    );
  }

  onNextStep(): void {
    console.log(this.myReportSaved);
    if (!this.stepsService.isLastStep()) {
      this.stepsService.moveToNextStep();
    } else {
      this.isReportGenerate = true;
    }
  }

  onPrevStep(): void {
    if (!this.stepsService.isFirstStep()) {
      this.stepsService.moveToPrevStep();
    }
  }

  generateReport(): void {
    this.storeService.setData(
      StoreKeys.REPORT,
      JSON.stringify(this.myReportSaved)
    );
    this.storeService.setData(StoreKeys.JOBS_BY_CATEGORY, this.jobsByCategory);
    this.storeService.setData(StoreKeys.JOB_CATEGORY, this.jobCategory);

    let reportGeneratedRequest: ReportGeneratedRequest = {
      // reportGeneratedId: this.guidService.generate(),
      creationDate: new Date(),
      modificationDate: new Date(),
      userId: this.tokenData.UserId,
      baseId: this.selectedClientId,
      subBaseId: this.selectedSubbaseId,
      reportId: this.selectedReport.reportId,
      // isPublic: false,
      expirationDate: new Date(),
      individualId: this.myReportSaved.individualIds[0],
      areaId: this.myReportSaved.areaId,
      groupId: this.myReportSaved.groupId,
      reportStyleId: null,
      leaderIndividualId: this.myReportSaved.leaderIndividualId,
      feedbackText: this.myReportSaved.hrFeedback
        ? this.myReportSaved.hrFeedback
        : null,
    };

    this.generateReportSub = this.generateReportLoader
      .load(this.generatedReporsService.generateReport(reportGeneratedRequest))
      .subscribe({
        next: reportGeneratedId => {
          this.generateRestEntities(reportGeneratedId);
        },
        error: err => {
          this.setError(
            [
              `CONFIGURATION.${ReportResponseType.ERROR}.${ReportResponseType.ERROR_REPORT}`,
            ],
            ReportResponseType.ERROR
          );
        },
      });
  }

  setError(message: string[], type: string): void {
    this.modalService.openPopUp(
      ResponseDialogComponent,
      this.getParams(message, type, 'response-error')
    );

    let timer = setInterval(() => {
      clearInterval(timer);
      timer = null;
      this.resetConfiguration();
      this.modalService.dialogRef.close(true);
    }, 3000);

    this.modalService.confirmedPopUp().subscribe((response: any) => {
      if (timer) {
        clearInterval(timer);
        this.resetConfiguration();
      }
    });
  }

  resetConfiguration(): void {
    let stepsConfiguration = this.getStepsConfiguration();
    this.stepsService.setSteps(this.getStepsConfiguration());
    this.stepsService.setCurrentStep(stepsConfiguration[0]);
    this.myReportSaved = new MyReport();
    this.isReportGenerate = false;
    this.cleanConfigStorage();
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

  generateRestEntities(reportGeneratedId: string): void {
    let obs: Array<Observable<any>> = [];
    if (
      this.myReportSaved.competenciesIds &&
      this.myReportSaved.competenciesIds.length > 0
    ) {
      obs.push(this.generateCompetencyByReport(reportGeneratedId));
    }
    if (this.myReportSaved.jobId) {
      obs.push(this.generateJobByReport(reportGeneratedId));
    }
    if (obs.length > 0) {
      this.generateSetObsSub = combineLatest(...obs)
        .pipe()
        .subscribe({
          next: (response: (any | any)[]) => {
            if (
              response.some(value =>
                ['ERROR_JOB_REPORT', 'ERROR_COMPETENCY_REPORT'].includes(value)
              )
            ) {
              this.loadErrors(response);
            } else {
              this.router.navigate(['/app/reports']);
            }
          },
          error: (err: Error) => {},
          complete: () => {},
        });
    }
  }

  loadErrors(response: string[]): void {
    let resultError: string[] = [];

    for (let i = 0; i < response.length; i++) {
      if (
        response[i] === 'ERROR_JOB_REPORT' ||
        response[i] === 'ERROR_COMPETENCY_REPORT'
      ) {
        resultError.push(`CONFIGURATION.ERROR.${response[i]}`);
      }
    }
    this.setWarning(
      resultError,
      ReportResponseType.WARNING,
      'response-warning'
    );
  }

  setWarning(resultError: string[], type: string, panelClass: string): void {
    this.modalService.openPopUp(
      ResponseDialogComponent,
      this.getParams(resultError, type, panelClass)
    );

    let timer = setInterval(() => {
      clearInterval(timer);
      timer = null;
      this.modalService.dialogRef.close(true);
      this.router.navigate(['/app/reports']);
    }, 3000);

    this.modalService.confirmedPopUp().subscribe((response: any) => {
      if (timer) {
        clearInterval(timer);
        this.router.navigate(['/app/reports']);
      }
    });
  }

  generateCompetencyByReport(reportGeneratedId: string): Observable<string> {
    let request: ReportGeneratedCompetencyRequest[] = [];

    for (let i = 0; i < this.myReportSaved.competenciesIds.length; i++) {
      let reportGeneratedCompetency: ReportGeneratedCompetencyRequest = {
        competencyId: this.myReportSaved.competenciesIds[i],
        reportGeneratedCompetencyId: this.guidService.generate(),
      };
      request.push(reportGeneratedCompetency);
    }

    return this.generateCompetencyByReportLoader
      .load(
        this.generatedReporsService.generateCompetencyByReport(
          reportGeneratedId,
          request
        )
      )
      .pipe(
        catchError(error => {
          console.log('error: ', error);
          return of('ERROR_COMPETENCY_REPORT');
        })
      );
  }

  generateJobByReport(reportGeneratedId: string): Observable<string> {
    let request: ReportGeneratedJobRequest = {};
    request.jobId = this.myReportSaved.jobId;
    request.reportGeneratedJobId = this.guidService.generate();

    return this.generateJobByReportLoader
      .load(
        this.generatedReporsService.generateJobByReport(reportGeneratedId, [
          request,
        ])
      )
      .pipe(
        catchError(error => {
          console.log('error: ', error);
          return of('ERROR_JOB_REPORT');
        })
      );
  }

  getStepsConfiguration(): StepModel[] {
    const steps: StepModel[] = this.selectedStepConfiguration?.steps.reduce(
      (
        accumulator: StepModel[],
        currentValue: ItemStepConfiguration,
        idx: number
      ) => {
        accumulator.push({
          stepIndex: idx + 1,
          isComplete:
            idx + 1 === 1 && currentValue.name === 'selectStyle' ? true : false,
        });
        return accumulator;
      },
      []
    );
    return steps;
  }

  //Methods for saving report selected data, form child components
  saveReportStyle(event: ReportStyles): void {
    this.myReportSaved.style = event.key;
  }

  saveHrFeedbackText(event: string): void {
    this.myReportSaved.hrFeedback = event;
  }

  saveReportIndividual(
    event: VwGetAllIndividualWithBehaviouralProfile[]
  ): void {
    this.myReportSaved.individualIds = event.map(vwIndividual => {
      return vwIndividual.individualId;
    });
    this.myReportSaved.baseId = event[0]?.baseId;
    this.myReportSaved.subBaseId = event[0]?.subbaseId;
  }

  saveReportJob(event: Job): void {
    this.myReportSaved.jobId = event.jobId;
    this.myReportSaved.jobCategoryId = event.jobCategoryId;
  }

  saveJobsByCategory(event: Job[]): void {
    this.jobsByCategory = event;
  }

  saveJobCategory(event: JobCategory): void {
    this.jobCategory = event;
  }

  saveReportCompetencies(event: Competency[]): void {
    this.myReportSaved.competenciesIds = event.map(competency => competency.id);
  }

  saveReportGroup(group: string): void {
    this.myReportSaved.groupId = group;
  }

  saveGroupOfIndividuals(event: string[]): void {
    this.myReportSaved.groupIndividuals = event;
  }

  saveReportArea(area: string): void {
    this.myReportSaved.areaId = area;
  }

  saveAreaOfIndividuals(event: string[]): void {
    this.myReportSaved.areaIndividuals = event;
  }

  saveInvidualAreaLeader(leader: string): void {
    this.myReportSaved.leaderIndividualId = leader;
  }

  changeClient(client: string): void {
    console.log('changeClient', client);
    this.selectedClientId = client;
  }

  changeSubbase(subbase: string): void {
    console.log('changeSubbase', subbase);

    this.selectedSubbaseId = subbase;
  }

  changeTypeFilters(typeFilterList: TypeFilter[]): void {
    this.typeFilterList = typeFilterList;
  }

  get showLabelStep(): string {
    return !this.isLastStep ? 'Continuar' : 'Finalizar';
  }

  get isLastStep(): boolean {
    return this.stepsService.isLastStep();
  }

  get isLastStepAndComplete(): boolean {
    return this.stepsService.isLastStepAndComplete();
  }
}
