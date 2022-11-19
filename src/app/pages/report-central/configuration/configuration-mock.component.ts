import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { StepsService } from '../../../core/services/steps.service';
import { StepModel } from '../../../core/models/step.model';
import {
  Observable,
  Subscription,
  catchError,
  combineLatest,
  of,
  take,
} from 'rxjs';
import { ReportConfigurationSteps } from '../../../core/configs/report-configuration-steps.config';
import { ConfigurationSteps } from '../../../core/models/configuration-steps.model';
import { SelectedReport } from '../../../core/models/reportType.model';
import { StoreService } from '../../../core/services/store.service';
import { StoreKeys } from '../../../core/consts/store-keys.enum';
import { unsubscribe } from 'src/app/core/utils/subscription.util';
import { MyReport } from './interfaces/myReport.interface';
import {
  Job,
  JobCategory,
} from 'src/app/core/services/microservices/job/job.interface';
import { ReportStyles } from './interfaces/reportStyles.interface';
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
import { GuidService } from '../../../core/services/guid.service';
import { getDifferenceBetweenArray } from '../../../shared/utils/arrays.util';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../../../shared/components/individuals/modal/confirm-dialog/confirm-dialog.component';
import {
  GeneratedReport,
  GeneratedReportByIdResponse,
} from '../../../core/services/microservices/reports/interfaces/generatedReportsResponse.interface';
import { StepConfiguration } from '../../../core/configs/steps-configuration/interfaces/steps-configuration.interface';
import { TemplateConfiguration } from './interfaces/template-configuration.interface';
import {
  DuplicateReportGeneratedRequest,
  DuplicateReportGeneratedResponse,
} from '../../../core/services/microservices/reports/interfaces/duplicateReportGenerated.interface';
import { InputDialogComponent } from '../my-templates/modal/input-dialog/input-dialog.component';
import { MultipleReportResponseDialogComponent } from 'src/app/pages/report-central/configuration/modal/multiple-report-dialog/multiple-report-response-dialog.component';
import { LocalStepModel } from './interfaces/local-step-model.interface';
import { ConfigurationReportService } from '../../../core/services/microservices/reports/configuration-report.service';
import { StepConfigurationResponse } from '../../../core/services/microservices/reports/interfaces/configuration-report.interface';
import { ConfigurationService } from './configuration.service';
import { IndividualFilterService } from 'src/app/core/services/individual/individual-filter.service';

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
  generatedReportByIdResponse: GeneratedReportByIdResponse;

  currentStep!: LocalStepModel;
  currentStepSub!: Subscription;

  myReportSaved: MyReport;

  selectedClientId: string = null;
  selectedSubbaseId: string = null;

  typeFilterList: TypeFilter[];
  filterSubscription: Subscription;

  //Variables
  tokenData: any;
  messageError: string;
  myGeneratedReport: GeneratedReport;

  //Templates
  generatedReportByIdResponseTemplate: GeneratedReportByIdResponse;
  templateConfiguration?: TemplateConfiguration;

  //Loaders
  generateReportLoader: Loader;
  generateUpdateReportLoader: Loader;
  generateCompetencyByReportLoader: Loader;
  generateJobByReportLoader: Loader;
  generateGroupingIndividualByReportLoader: Loader;
  generateAreaIndividualByReportLoader: Loader;
  getGeneratedReportByShortIdLoader: Loader;
  configurationReportLoader: Loader;

  //Subscriptions
  generateReportSub: Subscription;
  generateUpdateReportSub: Subscription;
  generateJobByReportSub: Subscription;
  generateGroupingIndividualByReportSub: Subscription;
  generateAreaIndividualByReportSub: Subscription;
  generateSetObsSub: Subscription;
  timerSub: Subscription;
  getGeneratedReportByShortIdSub: Subscription;
  configurationReportServiceSub: Subscription;

  constructor(
    private stepsService: StepsService,
    private router: Router,
    private storeService: StoreService,
    private generatedReporsService: GeneratedReportsService,
    private cookieStorageService: CookieStorageService,
    private modalService: ModalService,
    private guidService: GuidService,
    private configurationReportService: ConfigurationReportService,
    private configurationService: ConfigurationService,
    private individualFilterService: IndividualFilterService
  ) {
    this.selectedReport = this.storeService.getData(StoreKeys.TYPE_REPORT)
      ? JSON.parse(this.storeService.getData(StoreKeys.TYPE_REPORT))
      : null;
    if (this.selectedReport) {
      this.initLoaders();
      this.loadStorageValues();
      this.loadStepConfiguration();
    } else {
      this.router.navigate(['/app']);
    }
  }

  ngOnInit(): void {
    const cookieJWT = this.cookieStorageService.getCookie('JWTToken');
    this.tokenData = decodeToken(cookieJWT);
    this.isReportGenerate = false;
    this.loadCurrentStep();
  }

  ngOnDestroy(): void {
    unsubscribe(this.currentStepSub);
    unsubscribe(this.generateReportSub);
    unsubscribe(this.generateUpdateReportSub);
    unsubscribe(this.getGeneratedReportByShortIdSub);
    unsubscribe(this.generateSetObsSub);
    this.deleteConfigurationStorage();
  }

  subscribeFilterChange(): void {
    this.filterSubscription =
      this.individualFilterService.typeFilterListEvent.subscribe(
        (resp: any) => {
          this.typeFilterList = resp;
        }
      );
  }

  deleteConfigurationStorage(): void {
    this.storeService.clearValue(StoreKeys.MY_GENERATED_REPORT);
    this.storeService.clearValue(StoreKeys.JOBS_BY_CATEGORY);
    this.storeService.clearValue(StoreKeys.JOB_CATEGORY);
    this.storeService.clearValue(StoreKeys.SELECTED_INDIVIDUALS);
    this.storeService.clearValue(StoreKeys.SELECTED_JOB);
    this.storeService.clearValue(StoreKeys.SELECTED_JOB_CATEGORY);
    this.storeService.clearValue(StoreKeys.SELECTED_INDIVIDUALS_BY_GROUP);
    this.storeService.clearValue(StoreKeys.PRESELECTED_IDS);
    this.storeService.clearValue(StoreKeys.SELECTED_INDIVIDUALS_IDS_BY_AREA);
    this.storeService.clearValue(StoreKeys.SELECTED_LEADER_ID_BY_AREA);
    this.storeService.clearValue(StoreKeys.SELECTED_AREA_ID);
    this.storeService.clearValue(StoreKeys.SELECTED_COMPETENCIES);
    this.storeService.clearValue(StoreKeys.SELECTED_HRFEEDBACK);
    this.storeService.clearValue(StoreKeys.REPORT_TEMPLATE_CONFIGURATION);
  }

  initLoaders(): void {
    this.generateReportLoader = new Loader();
    this.generateUpdateReportLoader = new Loader();
    this.generateCompetencyByReportLoader = new Loader();
    this.generateJobByReportLoader = new Loader();
    this.generateGroupingIndividualByReportLoader = new Loader();
    this.generateAreaIndividualByReportLoader = new Loader();
    this.getGeneratedReportByShortIdLoader = new Loader();
    this.configurationReportLoader = new Loader();
  }

  loadStepConfiguration(): void {
    this.configurationReportServiceSub = this.configurationReportLoader
      .load(this.configurationReportService.getStepConfiguration())
      .subscribe({
        next: (resp: StepConfigurationResponse) => {
          this.loadTemplateConfiguration();
          this.myReportSaved = new MyReport();
          //Obtengo tipo de reporte seleccionado
          this.selectedStepConfiguration = resp;

          const stepConfiguration =
            this.configurationService.getConfigurationStepMapping(
              this.selectedStepConfiguration
            );
          this.stepsService.initSteps(stepConfiguration);
          if (
            this.templateConfiguration?.isTemplate &&
            !this.templateConfiguration.templateCreation
          ) {
            const stepIndividual = stepConfiguration.find(
              x => x.stepName === 'selectIndividuals'
            );
            if (stepIndividual) {
              this.stepsService.setCurrentStep(stepIndividual);
            }
          } else {
            if (
              this.myGeneratedReport &&
              !this.templateConfiguration?.isTemplate
            ) {
              //Info para editar reporte
              this.loadGeneratedReportByShortId(this.myGeneratedReport.shortId);
            }
          }
          this.subscribeFilterChange();
          if (!this.typeFilterList && this.selectedClientId) {
            this.individualFilterService.loadGenderFilter(
              this.selectedClientId
            );
          }
        },
        error: err => {
          console.log(
            'No se pudo obtener las pasos de configuracion del reporte seleccionado: ',
            err
          );
        },
      });
  }

  loadStorageValues(): void {
    this.myGeneratedReport = this.storeService.getData(
      StoreKeys.MY_GENERATED_REPORT
    );

    this.templateConfiguration = this.storeService.getData(
      StoreKeys.REPORT_TEMPLATE_CONFIGURATION
    );
  }

  loadTemplateConfiguration(): void {
    if (
      this.templateConfiguration &&
      this.templateConfiguration.isTemplate &&
      !this.templateConfiguration.templateCreation
    ) {
      if (this.myGeneratedReport) {
        this.changeClient(this.myGeneratedReport.baseId);
        this.changeSubbase(this.myGeneratedReport.subBaseId);
      }

      this.updateGeneratedReportByIdResponseTemplate(
        this.templateConfiguration.templateCreationId
      );
    }
  }

  loadGeneratedReportByShortId(id: string): void {
    this.getGeneratedReportByShortIdSub = this.getGeneratedReportByShortIdLoader
      .load(this.generatedReporsService.getGeneratedReportByShortId(id))
      .subscribe({
        next: (res: GeneratedReportByIdResponse) => {
          this.generatedReportByIdResponse = res;
        },
        error: err => {
          console.log('error al recuperar datos del reportes generado: ', err);
        },
      });
  }

  loadCurrentStep(): void {
    this.currentStepSub = this.stepsService
      .getCurrentStep()
      .subscribe((step: LocalStepModel) => {
        this.currentStep = step;
      });
  }

  onNextStep(): void {
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
    if (
      !this.myReportSaved.individualIds ||
      this.myReportSaved.individualIds.length < 1
    ) {
      this.setWarning(
        ['No se han seleccionado individuos para generar el reporte'],
        ReportResponseType.WARNING,
        'response-warning'
      );
      return;
    }
    if (
      this.generatedReportByIdResponseTemplate &&
      this.templateConfiguration?.isTemplate
    ) {
      const obs: Array<Observable<any>> =
        this.loadUpdateRestEntitiesObsRequest(true);

      if (
        this.configurationService.reportGeneratedAreEquals(
          true,
          this.generatedReportByIdResponseTemplate,
          this.generatedReportByIdResponse,
          this.myReportSaved
        ) &&
        obs.length < 1
      ) {
        //SON IGUALES
        this.duplicateReport(
          this.generatedReportByIdResponseTemplate.reportGeneratedId,
          this.myReportSaved.individualIds
        );
      } else {
        //Si hay diferencias.... Tengo que crear uno nuevo, y luego duplicar.
        this.generateNewGeneratedReport(false);
      }
    } else if (this.generatedReportByIdResponse) {
      if (
        this.myReportSaved.individualIds[0] ===
        this.generatedReportByIdResponse.individualId
      ) {
        //Comparo previamente el objeto del reporte con el nuevo que se va a actualizar
        if (
          this.configurationService.reportGeneratedAreEquals(
            false,
            this.generatedReportByIdResponseTemplate,
            this.generatedReportByIdResponse,
            this.myReportSaved
          )
        ) {
          this.generateUpdateRestEntities(false);
        } else {
          //Actualizo reporte
          this.updateReportGenerated(false);
        }
      } else {
        //Si selecciono otro individuo, genero un nuevo reporte. Informo que estara creando un nuevo reporte
        this.openModalConfirmationNewIndividualReport();
      }
    } else {
      this.generateNewGeneratedReport(false);
    }
  }

  openModalConfirmationNewIndividualReport(): void {
    const dialogData: ConfirmDialogModel = {
      title: 'Nuevo reporte',
      message: 'Se modifico el individuo. ¿Desea crear un nuevo reporte?',
    };
    this.modalService.openPopUp(ConfirmDialogComponent, {
      width: '600px',
      closeOnNavigation: true,
      data: dialogData,
    });
    this.modalService.confirmedPopUp().subscribe((data: any) => {
      if (data) {
        this.generateNewGeneratedReport(false);
      }
    });
  }

  openModalResponse(): void {
    const dialogData: ConfirmDialogModel = {
      title: 'Se actualizo el reporte',
      message: '¿Desea ver el nuevo reporte actualizado?',
    };
    this.modalService.openPopUp(ConfirmDialogComponent, {
      width: '600px',
      closeOnNavigation: true,
      data: dialogData,
    });
    this.modalService.confirmedPopUp().subscribe((data: any) => {
      if (data) {
        this.router.navigate([
          `/app/reports/${this.generatedReportByIdResponse.reportGeneratedId}`,
        ]);
      } else {
        this.router.navigate([`/app`]);
      }
    });
  }

  updateReportGenerated(isTemplate: boolean, templateName?: string): void {
    const reportGeneratedRequest = this.getGeneratedReportUpdateRequest(
      isTemplate,
      templateName
    );

    const updateId = isTemplate
      ? this.generatedReportByIdResponseTemplate.reportGeneratedId
      : this.generatedReportByIdResponse.reportGeneratedId;

    this.generateUpdateReportSub = this.generateUpdateReportLoader
      .load(
        this.generatedReporsService.updateReport(
          reportGeneratedRequest,
          updateId
        )
      )
      .subscribe({
        next: () => {
          this.generateUpdateRestEntities(isTemplate);
        },
        error: () => {
          this.setError(
            [
              `CONFIGURATION.${ReportResponseType.ERROR}.${ReportResponseType.ERROR_UPDATE_REPORT}`,
            ],
            ReportResponseType.ERROR
          );
        },
        complete: () => {},
      });
  }

  generateUpdateRestEntities(isTemplate: boolean): void {
    let obs: Array<Observable<any>> =
      this.loadUpdateRestEntitiesObsRequest(isTemplate);

    if (obs.length > 0) {
      this.generateSetObsSub = combineLatest(...obs)
        .pipe()
        .subscribe({
          next: (response: (any | any)[]) => {
            if (
              response.some(value =>
                [
                  ReportResponseType.ERROR_UPDATE_JOB_REPORT,
                  ReportResponseType.ERROR_UPDATE_COMPETENCY_REPORT,
                  ReportResponseType.ERROR_UPDATE_AREA_INDIVIDUAL_REPORT,
                  ReportResponseType.ERROR_UPDATE_GROUPING_INDIVIDUAL_REPORT,
                ].includes(value)
              )
            ) {
              this.loadErrors(response);
            } else {
              if (!isTemplate) {
                this.openModalResponse();
              } else {
                this.updateGeneratedReportByIdResponseTemplate(
                  this.generatedReportByIdResponseTemplate.reportGeneratedId
                );
                this.setWarning(
                  ['Plantilla actualizada'],
                  ReportResponseType.SUCCESS,
                  'response-success'
                );
              }
            }
          },
          error: () => {},
          complete: () => {},
        });
    } else {
      if (isTemplate) {
        this.updateGeneratedReportByIdResponseTemplate(
          this.generatedReportByIdResponseTemplate.reportGeneratedId
        );
        this.setWarning(
          ['Plantilla actualizada'],
          ReportResponseType.SUCCESS,
          'response-success'
        );
      }
    }
  }

  generateNewGeneratedReport(isTemplate: boolean, templateName?: string): void {
    const reportGeneratedRequest = this.getGeneratedReportRequest(
      isTemplate,
      templateName
    );

    this.generateReportSub = this.generateReportLoader
      .load(this.generatedReporsService.generateReport(reportGeneratedRequest))
      .subscribe({
        next: reportGeneratedId => {
          this.generateRestEntities(reportGeneratedId, isTemplate);
          if (isTemplate && !this.generatedReportByIdResponseTemplate) {
            //Si es un template lo que cree, guardo su info
            this.updateGeneratedReportByIdResponseTemplate(reportGeneratedId); //Aca no se si lo necesito.. esto es mas que nada para entidades relacionadas
          }
        },
        error: () => {
          this.setError(
            [
              `CONFIGURATION.${ReportResponseType.ERROR}.${ReportResponseType.ERROR_REPORT}`,
            ],
            ReportResponseType.ERROR
          );
        },
      });
  }

  generateRestEntities(reportGeneratedId: string, isTemplate: boolean): void {
    let obs: Array<Observable<any>> =
      this.loadCreateObsRequest(reportGeneratedId);

    if (obs.length > 0) {
      this.generateSetObsSub = combineLatest(...obs)
        .pipe()
        .subscribe({
          next: (response: (any | any)[]) => {
            if (
              response.some(value =>
                [
                  ReportResponseType.ERROR_JOB_REPORT,
                  ReportResponseType.ERROR_COMPETENCY_REPORT,
                  ReportResponseType.ERROR_AREA_INDIVIDUAL_REPORT,
                  ReportResponseType.ERROR_GROUPING_INDIVIDUAL_REPORT,
                ].includes(value)
              )
            ) {
              this.loadErrors(response);
            } else {
              if (!isTemplate && this.myReportSaved.individualIds.length > 1) {
                this.duplicateReport(
                  reportGeneratedId,
                  this.myReportSaved.individualIds.slice(1) //Quito al primero
                );
                //Ahora aca tengo que duplicar los reportes y mostrar un popUp con los resultados.
              } else if (!isTemplate) {
                //Si no es template redirecciono al reporte.
                this.router.navigate([`/app/reports/${reportGeneratedId}`]);
              } else {
                this.updateGeneratedReportByIdResponseTemplate(
                  reportGeneratedId
                );
                this.setWarning(
                  ['Plantilla Creada'],
                  ReportResponseType.SUCCESS,
                  'response-success'
                );
              }
            }
          },
          error: () => {},
          complete: () => {},
        });
    } else {
      if (isTemplate) {
        this.updateGeneratedReportByIdResponseTemplate(
          this.templateConfiguration.templateCreationId
        );
        this.setWarning(
          ['Plantilla Creada'],
          ReportResponseType.SUCCESS,
          'response-success'
        );
      }
    }
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

    this.modalService.confirmedPopUp().subscribe(() => {
      if (timer) {
        clearInterval(timer);
        this.resetConfiguration();
      }
    });
  }

  resetConfiguration(): void {
    let stepsConfiguration =
      this.configurationService.getConfigurationStepMapping(
        this.selectedStepConfiguration
      );
    this.stepsService.setSteps(
      this.configurationService.getConfigurationStepMapping(
        this.selectedStepConfiguration
      )
    );
    this.stepsService.setCurrentStep(stepsConfiguration[0]);
    this.myReportSaved = new MyReport();
    this.isReportGenerate = false;
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

  //#region  Obtengo Diferencias entre objetos y me devuelve los observables a ejecutar para actualizar

  loadUpdateRestEntitiesObsRequest(
    isTemplate: boolean
  ): Array<Observable<any>> {
    let obs: Array<Observable<any>> = [];

    const compareLocal = this.myReportSaved;
    const compareSaved =
      isTemplate && this.generatedReportByIdResponseTemplate
        ? this.generatedReportByIdResponseTemplate
        : this.generatedReportByIdResponse;

    //Actualizo las competencias
    let competenciesObs: Array<Observable<any>> =
      this.loadUpdateCompetenciesObsRequest(compareLocal, compareSaved);
    if (competenciesObs.length > 0) {
      //TODO: Descomentar en cuanto disponible el endpoint delete para eliminar individuos
      obs.push(...competenciesObs);
    }

    //Actualizo el puesto
    let jobObs: Array<Observable<any>> = this.loadUpdateJobObsRequest(
      compareLocal,
      compareSaved
    );
    if (jobObs.length > 0) {
      obs.push(...jobObs);
    }

    //Actualizo los individuos del area
    let individualsByAreaObs: Array<Observable<any>> =
      this.loadUpdateIndividualsByAreaObsRequest(compareLocal, compareSaved);
    if (individualsByAreaObs.length > 0) {
      obs.push(...individualsByAreaObs);
    }
    // //Actualizo los individuos del grupo
    let individualsByGroupObs: Array<Observable<any>> =
      this.loadUpdateIndividualsByGroupObsRequest(compareLocal, compareSaved);
    if (individualsByGroupObs.length > 0) {
      obs.push(...individualsByGroupObs);
    }

    return obs;
  }

  loadUpdateCompetenciesObsRequest(
    compareLocal: MyReport,
    compareSaved: GeneratedReportByIdResponse
  ): Array<Observable<any>> {
    let newIndividuals = [];

    const savedReportCompetencies =
      compareLocal.competenciesIds !== undefined &&
      compareLocal.competenciesIds.length > 0
        ? compareLocal.competenciesIds
        : [];

    //Busco los nuevos individuos a agregar
    newIndividuals = getDifferenceBetweenArray(
      savedReportCompetencies,
      compareSaved.reportGeneratedCompetencies.map(data => data.competencyId)
    );

    //Busco los individuos que no estaran en las competencias para eliminar
    let oldIndividuals = [];
    oldIndividuals = getDifferenceBetweenArray(
      compareSaved.reportGeneratedCompetencies.map(data => data.competencyId),
      savedReportCompetencies
    );

    let obs: Array<Observable<any>> = [];
    if (newIndividuals.length > 0) {
      obs.push(
        this.generateCompetencyByReport(
          compareSaved.reportGeneratedId,
          newIndividuals
        )
      );
    }
    if (oldIndividuals.length > 0) {
      let deleteGroupIndividualList =
        compareSaved.reportGeneratedCompetencies.filter(data =>
          oldIndividuals.includes(data.competencyId)
        );

      obs.push(
        this.deleteCompetenciesByReport(
          compareSaved.reportGeneratedId,
          deleteGroupIndividualList.map(
            data => data.reportGeneratedCompetencyId
          )
        )
      );
    }
    return obs;
  }

  loadUpdateJobObsRequest(
    compareLocal: MyReport,
    compareSaved: GeneratedReportByIdResponse
  ): Array<Observable<any>> {
    let obs: Array<Observable<any>> = [];

    if (compareLocal.jobId !== compareSaved.reportGeneratedJobs[0]?.jobId) {
      obs.push(
        this.generateJobByReport(
          compareSaved.reportGeneratedId,
          compareLocal.jobId
        )
      );
      obs.push(
        this.deleteJobByReport(
          compareSaved.reportGeneratedId,
          compareSaved.reportGeneratedJobs[0]?.reportGeneratedJobId
        )
      );
    }
    return obs;
  }

  loadUpdateIndividualsByAreaObsRequest(
    compareLocal: MyReport,
    compareSaved: GeneratedReportByIdResponse
  ): Array<Observable<any>> {
    let newIndividuals = [];

    const savedReportIndividuals =
      compareLocal.areaIndividuals !== undefined &&
      compareLocal.areaIndividuals.length > 0
        ? compareLocal.areaIndividuals
        : [];

    //Busco los nuevos individuos a agregar
    newIndividuals = getDifferenceBetweenArray(
      savedReportIndividuals,
      compareSaved.reportGeneratedAreaIndividuals.map(data => data.individualId)
    );

    //Busco los individuos que no estaran en el area para eliminar
    let oldIndividuals = [];
    oldIndividuals = getDifferenceBetweenArray(
      compareSaved.reportGeneratedAreaIndividuals.map(
        data => data.individualId
      ),
      savedReportIndividuals
    );

    let obs: Array<Observable<any>> = [];
    if (newIndividuals.length > 0) {
      obs.push(
        this.generateAreaIndividualByReport(
          compareSaved.reportGeneratedId,
          newIndividuals
        )
      );
    }
    if (oldIndividuals.length > 0) {
      let deleteIndividualsByArea =
        compareSaved.reportGeneratedAreaIndividuals.filter(data =>
          oldIndividuals.includes(data.individualId)
        );

      obs.push(
        this.deleteIndividualsAreaByReport(
          compareSaved.reportGeneratedId,
          deleteIndividualsByArea.map(data => data.individualId)
        )
      );
    }
    return obs;
  }

  loadUpdateIndividualsByGroupObsRequest(
    compareLocal: MyReport,
    compareSaved: GeneratedReportByIdResponse
  ): Array<Observable<any>> {
    let newIndividuals = [];

    const savedReportIndividuals =
      compareLocal.groupIndividuals !== undefined &&
      compareLocal.groupIndividuals.length > 0
        ? compareLocal.groupIndividuals
        : [];

    //Busco los nuevos individuos a agregar
    newIndividuals = getDifferenceBetweenArray(
      savedReportIndividuals,
      compareSaved.reportGeneratedGroupingIndividuals.map(
        data => data.individualId
      )
    );

    //Busco los individuos que no estaran en el area para eliminar
    let oldIndividuals = [];
    oldIndividuals = getDifferenceBetweenArray(
      compareSaved.reportGeneratedGroupingIndividuals.map(
        data => data.individualId
      ),
      savedReportIndividuals
    );

    let obs: Array<Observable<any>> = [];
    if (newIndividuals.length > 0) {
      obs.push(
        this.generateGroupingIndividualByReport(
          compareSaved.reportGeneratedId,
          newIndividuals
        )
      );
    }
    if (oldIndividuals.length > 0) {
      let deleteIndividualsByGroup =
        compareSaved.reportGeneratedGroupingIndividuals.filter(data =>
          oldIndividuals.includes(data.individualId)
        );

      obs.push(
        this.deleteIndividualsGroupByReport(
          compareSaved.reportGeneratedId,
          deleteIndividualsByGroup.map(data => data.individualId)
        )
      );
    }
    return obs;
  }
  //#endregion

  loadCreateObsRequest(reportGeneratedId: string): Array<Observable<any>> {
    let obs: Array<Observable<any>> = [];

    //Agrego nuevas competencias al reporte
    if (
      this.myReportSaved.competenciesIds &&
      this.myReportSaved.competenciesIds.length > 0
    ) {
      obs.push(
        this.generateCompetencyByReport(
          reportGeneratedId,
          this.myReportSaved.competenciesIds
        )
      );
    }

    //Agrego nuevo puesto al reporte
    if (this.myReportSaved.jobId) {
      obs.push(
        this.generateJobByReport(reportGeneratedId, this.myReportSaved.jobId)
      );
    }

    //Agrego los individuos del area
    if (
      this.myReportSaved.areaIndividuals &&
      this.myReportSaved.areaIndividuals.length > 0
    ) {
      obs.push(
        this.generateAreaIndividualByReport(
          reportGeneratedId,
          this.myReportSaved.areaIndividuals
        )
      );
    }

    //Agrego los individuos al grupo
    if (
      this.myReportSaved.groupIndividuals &&
      this.myReportSaved.groupIndividuals.length > 0
    ) {
      obs.push(
        this.generateGroupingIndividualByReport(
          reportGeneratedId,
          this.myReportSaved.groupIndividuals
        )
      );
    }

    return obs;
  }

  loadErrors(response: string[]): void {
    let resultError: string[] = [];

    for (let i = 0; i < response.length; i++) {
      if (
        response[i] === ReportResponseType.ERROR_JOB_REPORT ||
        response[i] === ReportResponseType.ERROR_COMPETENCY_REPORT ||
        response[i] === ReportResponseType.ERROR_AREA_INDIVIDUAL_REPORT ||
        response[i] === ReportResponseType.ERROR_GROUPING_INDIVIDUAL_REPORT
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
    }, 3000);

    this.modalService.confirmedPopUp().subscribe(() => {
      if (timer) {
        clearInterval(timer);
      }
      if (type === ReportResponseType.ERROR) {
        this.router.navigate(['/app/reports']);
      }
    });
  }

  //#region Ejecucion de metodos CRUD GeneratedReports, ret: Observable<string>
  generateCompetencyByReport(
    reportGeneratedId: string,
    competenciesIds: string[]
  ): Observable<string> {
    let request: ReportGeneratedCompetencyRequest[] = [];

    for (let i = 0; i < competenciesIds.length; i++) {
      let reportGeneratedCompetency: ReportGeneratedCompetencyRequest = {
        competencyId: competenciesIds[i],
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
          return of(ReportResponseType.ERROR_COMPETENCY_REPORT);
        })
      );
  }

  generateJobByReport(
    reportGeneratedId: string,
    jobId: string
  ): Observable<string> {
    let request: ReportGeneratedJobRequest = {};
    request.jobId = jobId;
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
          return of(ReportResponseType.ERROR_JOB_REPORT);
        })
      );
  }

  generateGroupingIndividualByReport(
    reportGeneratedId: string,
    individuals: string[]
  ): Observable<string> {
    return this.generateCompetencyByReportLoader
      .load(
        this.generatedReporsService.generateGroupingIndividualByReport(
          reportGeneratedId,
          individuals
        )
      )
      .pipe(
        catchError(error => {
          console.log('error: ', error);
          return of(ReportResponseType.ERROR_GROUPING_INDIVIDUAL_REPORT);
        })
      );
  }

  generateAreaIndividualByReport(
    reportGeneratedId: string,
    individuals: string[]
  ): Observable<string> {
    return this.generateCompetencyByReportLoader
      .load(
        this.generatedReporsService.generateAreaIndividualByReport(
          reportGeneratedId,
          individuals
        )
      )
      .pipe(
        catchError(error => {
          console.log('error: ', error);
          return of(ReportResponseType.ERROR_AREA_INDIVIDUAL_REPORT);
        })
      );
  }

  deleteCompetenciesByReport(
    reportGeneratedId: string,
    competenciesToDelete: string[]
  ): Observable<string> {
    return this.generateCompetencyByReportLoader
      .load(
        this.generatedReporsService.deleteCompetenciesByReport(
          reportGeneratedId,
          competenciesToDelete
        )
      )
      .pipe(
        catchError(error => {
          console.log('error: ', error);
          return of(ReportResponseType.ERROR_UPDATE_COMPETENCY_REPORT);
        })
      );
  }

  deleteJobByReport(
    reportGeneratedId: string,
    reportGeneratedJobId: string
  ): Observable<string> {
    return this.generateCompetencyByReportLoader
      .load(
        this.generatedReporsService.deleteJobByReport(
          reportGeneratedId,
          reportGeneratedJobId
        )
      )
      .pipe(
        catchError(error => {
          console.log('error: ', error);
          return of(ReportResponseType.ERROR_UPDATE_JOB_REPORT);
        })
      );
  }

  deleteIndividualsAreaByReport(
    reportGeneratedId: string,
    individualsToDelete: string[]
  ): Observable<string> {
    return this.generateCompetencyByReportLoader
      .load(
        this.generatedReporsService.deleteIndividualsAreaByReport(
          reportGeneratedId,
          individualsToDelete
        )
      )
      .pipe(
        catchError(error => {
          console.log('error: ', error);
          return of(ReportResponseType.ERROR_UPDATE_AREA_INDIVIDUAL_REPORT);
        })
      );
  }

  deleteIndividualsGroupByReport(
    reportGeneratedId: string,
    individualsToDelete: string[]
  ): Observable<string> {
    return this.generateCompetencyByReportLoader
      .load(
        this.generatedReporsService.deleteIndividualsGroupingByReport(
          reportGeneratedId,
          individualsToDelete
        )
      )
      .pipe(
        catchError(error => {
          console.log('error: ', error);
          return of(ReportResponseType.ERROR_UPDATE_GROUPING_INDIVIDUAL_REPORT);
        })
      );
  }
  //#endregion

  //Methods for saving report selected data, form child components
  //#region savingReportData in this.myReportSaved
  saveReportStyle(event: ReportStyles): void {
    this.myReportSaved.style = event.key;
  }

  saveHrFeedbackText(event: string): void {
    this.myReportSaved.feedbackText = event;
  }

  saveReportIndividual(selectedIndividuals: string[]): void {
    this.myReportSaved.individualIds = selectedIndividuals;
    this.myReportSaved.baseId = this.selectedClientId;
    this.myReportSaved.subBaseId = this.selectedSubbaseId;
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

  saveReportCompetencies(event: string[]): void {
    this.myReportSaved.competenciesIds = event;
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
  //#endregion

  changeClient(client: string): void {
    this.selectedClientId = client;
  }

  changeSubbase(subbase: string): void {
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

  get labelTemplate(): string {
    return !this.templateConfiguration.templateCreation
      ? 'Crear Template'
      : 'Actualizar Template';
  }

  get generatedReport(): GeneratedReportByIdResponse {
    return this.templateConfiguration?.isTemplate
      ? this.generatedReportByIdResponseTemplate
      : this.generatedReportByIdResponse;
  }

  saveTemplateButton(): void {
    if (!this.generatedReportByIdResponseTemplate) {
      this.openModalNewTemplate();
    } else {
      this.saveTemplate();
    }
  }

  openModalNewTemplate(): void {
    const dialogData: ConfirmDialogModel = {
      title: 'Nuevo Plantilla',
      message: 'Desea Crear una nueva plantilla?',
    };
    this.modalService.openPopUp(InputDialogComponent, {
      width: '600px',
      closeOnNavigation: true,
      data: dialogData,
    });
    this.modalService
      .confirmedPopUp()
      .subscribe((templateName: string | null) => {
        if (templateName) {
          this.generateNewGeneratedReport(true, templateName);
        }
      });
  }

  saveTemplate(): void {
    //Editando un template
    if (
      this.configurationService.reportGeneratedAreEquals(
        true,
        this.generatedReportByIdResponseTemplate,
        this.generatedReportByIdResponse,
        this.myReportSaved
      )
    ) {
      this.generateUpdateRestEntities(true);
    } else {
      //Actualizo GeneratedReport Tambien
      this.updateReportGenerated(true);
    }
  }

  duplicateReport(generatedReportId: string, individualIds: string[]): void {
    const request: DuplicateReportGeneratedRequest = {
      userId: this.tokenData.userId,
      subbaseId: this.selectedSubbaseId,
      generatedReportId: generatedReportId, //this.templateConfiguration.templateCreationId,
      newIndividualIds: individualIds,
      includeReportOwnerIndividual: true,
    };

    this.generatedReporsService
      .duplicateReport(request)
      .subscribe((resp: DuplicateReportGeneratedResponse[]) => {
        const dialogData: any = {
          title: 'Creacion de reportes',
          message: 'Generando reportes...Message',
          multipleReportGeneratedResponse: resp,
        };

        this.modalService.openPopUp(MultipleReportResponseDialogComponent, {
          width: '600px',
          closeOnNavigation: true,
          data: dialogData,
        });
        this.modalService.confirmedPopUp().subscribe(() => {});
      });
  }

  updateGeneratedReportByIdResponseTemplate(id: string): void {
    this.getGeneratedReportByShortIdSub = this.getGeneratedReportByShortIdLoader
      .load(this.generatedReporsService.getGeneratedReportByShortId(id))
      .subscribe({
        next: (res: GeneratedReportByIdResponse) => {
          this.generatedReportByIdResponseTemplate = res;
        },
        error: err => {
          console.log('error al recuperar datos del reportes generado: ', err);
        },
      });
  }

  getGeneratedReportRequest(
    isTemplate: boolean,
    templateName?: string
  ): ReportGeneratedRequest {
    return {
      creationDate: new Date(),
      userId: this.tokenData.UserId,
      baseId: this.selectedClientId,
      subBaseId: this.selectedSubbaseId,
      reportId: this.selectedReport.reportId,
      individualId: isTemplate ? null : this.myReportSaved.individualIds[0],
      areaId: this.myReportSaved.areaId,
      groupId: this.myReportSaved.groupId,
      reportStyleId: null,
      leaderIndividualId: this.myReportSaved.leaderIndividualId,
      feedbackText: this.myReportSaved.feedbackText,
      name: templateName,
      isTemplate: isTemplate,
    };
  }

  getGeneratedReportUpdateRequest(
    isTemplate: boolean,
    templateName?: string
  ): ReportGeneratedRequest {
    const baseInfo = isTemplate
      ? this.generatedReportByIdResponseTemplate
        ? this.generatedReportByIdResponseTemplate
        : this.generatedReportByIdResponse
      : this.generatedReportByIdResponse;
    return {
      reportGeneratedId: baseInfo.reportGeneratedId,
      userId: this.tokenData.UserId,
      reportId: this.selectedReport.reportId,
      isPublic: false,
      baseId: baseInfo.baseId ? baseInfo.baseId : this.selectedClientId,
      subBaseId: baseInfo.subBaseId
        ? baseInfo.subBaseId
        : this.selectedSubbaseId,
      individualId: isTemplate ? null : this.myReportSaved.individualIds[0],
      areaId: this.myReportSaved.areaId,
      groupId: this.myReportSaved.groupId,
      reportStyleId: null,
      leaderIndividualId: this.myReportSaved.leaderIndividualId,
      feedbackText: this.myReportSaved.feedbackText,
      pdaAssessmentOutcomeId: isTemplate
        ? null
        : this.generatedReport.pdaAssessmentOutcomeId,
      isTemplate: isTemplate,
      name: templateName ? templateName : baseInfo.name,
    };
  }
}
