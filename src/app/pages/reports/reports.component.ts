import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import {
  CssColorService,
  PropertyNames,
} from '../../core/services/css-color.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportsEventService } from './reports-event.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { unsubscribe } from '../../core/utils/subscription.util';
import { StoreService } from '../../core/services/store.service';
import { StoreKeys } from '../../core/consts/store-keys.enum';
import { ReportEvent } from '../../core/consts/report-event.enum';
import { ReportTypeStatus } from '../../core/consts/report-type-status.enum';
import {
  MultipleJobCompatibility,
  PDAIndividualSectionsResponse,
} from '../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { PDAGroupSectionsResponse } from '../../core/services/microservices/reports/interfaces/pdaGroupSectionsResponse.interface';
import { ReportsService } from '../../core/services/microservices/reports/reports.service';
import { PDAIndividualSectionsRequest } from '../../core/services/microservices/reports/interfaces/pdaIndividualSectionsRequest.interface';
import { PDAGroupSectionsRequest } from '../../core/services/microservices/reports/interfaces/pdaGroupSectionsRequest.interface';
import { MyReport } from '../report-central/configuration/interfaces/myReport.interface';
import { AuthenticationService } from '../../core/authentication/authentication.service';
import {
  GetJobsResponse,
  Job,
  JobCategory,
} from '../../core/services/microservices/job/job.interface';
import {
  ConfigurationTypesReports,
  listScreenByReport,
} from '../../core/configs/report-type.config';
import { Loader } from 'src/app/core/services/loader/loader';
import { GeneratedReport } from 'src/app/core/services/microservices/reports/interfaces/generatedReportsResponse.interface';
import { GeneratedReportsService } from 'src/app/core/services/microservices/reports/generated-reports.service';
import { ReportsLocal } from '../report-central/interfaces/reports-local.interface';
import { catchError, take } from 'rxjs';
import { ReportGeneratedCompetency } from '../../core/services/microservices/reports/interfaces/generatedReportsResponse.interface';
import { JobService } from '../../core/services/microservices/job/job.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit, OnDestroy {
  dataIndividualSectionsResponse!: PDAIndividualSectionsResponse;
  dataGroupSectionsResponse!: PDAGroupSectionsResponse;

  //bindings
  PropertyNames = PropertyNames;
  backgroundUserImage = null;
  logoImage = null;
  selectedReport: ReportsLocal = null;
  reportTypeStatus = ReportTypeStatus;
  selectReportType: ConfigurationTypesReports;
  selectOnlyProfile: ConfigurationTypesReports;
  reportId: string;

  //ViewChilds
  @ViewChild('checkStrengthsOverusedSection')
  checkStrengthsOverusedSection: ElementRef;

  //Variables
  firstTime: boolean = false;
  jobsByCategory: Job[];
  multipleJobCompatibility: MultipleJobCompatibility[];
  jobsList: string[];
  jobCategory: JobCategory;

  //Subscriptions
  reportsSub!: Subscription;
  reportsGroupSub!: Subscription;
  multipleJobCompatibilitySub!: Subscription;
  generatedReportsSub: Subscription;
  reportsLocalSub: Subscription;
  jobCategoriesSub: Subscription;

  //Loader
  generatedReportsLoader: Loader;
  multipleJobCompatibilityLoader: Loader;
  jobsByCategoryLoader: Loader;
  individualsSectionsLoader: Loader;
  categoryByJobLoader: Loader;
  reportsLocalLoader: Loader;
  jobCategoriesLoader: Loader;

  requestReportData!: MyReport;

  //progress bar
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 57;
  bufferValue = 75;

  constructor(
    private reportsService: ReportsService,
    private reportsEventService: ReportsEventService,
    private cssColorService: CssColorService,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private authenticationService: AuthenticationService,
    private generatedReportsService: GeneratedReportsService,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.initLoader();

    //TODO: Recibo el id del reporte generado
    let idReportGenerated = this.route.snapshot.paramMap.get('id');

    //TODO: Descomentar hasta tener resto de la maqueta de reportes
    let reportData = this.storeService.getData(StoreKeys.REPORT);
    if (reportData) {
      this.requestReportData = JSON.parse(reportData);
      this.loadReport();
    } else {
      this.getGeneratedReportById(idReportGenerated);
    }

    //TODO: Tratar dato de servicio cuando se retome la funcionalidad de grupos
    // this.loadGroupSections();
  }

  ngOnDestroy(): void {
    unsubscribe(this.reportsSub);
    unsubscribe(this.reportsGroupSub);
    unsubscribe(this.multipleJobCompatibilitySub);
    unsubscribe(this.generatedReportsSub);
    unsubscribe(this.reportsLocalSub);
    unsubscribe(this.jobCategoriesSub);
  }

  initLoader(): void {
    this.generatedReportsLoader = new Loader();
    this.multipleJobCompatibilityLoader = new Loader();
    this.jobsByCategoryLoader = new Loader();
    this.individualsSectionsLoader = new Loader();
    this.categoryByJobLoader = new Loader();
    this.reportsLocalLoader = new Loader();
    this.jobCategoriesLoader = new Loader();
  }

  loadReport(): void {
    this.loadReportType();
    this.loadStyleReport();
    this.cssColorService.loadColors();
    setTimeout(() => {
      this.reportsEventService.setCurrentReport(ReportEvent.IS_REPORT);
    }, 0);
    this.loadInvidualSections();
  }

  getGeneratedReportById(id: string): void {
    this.generatedReportsSub = this.generatedReportsLoader
      .load(this.generatedReportsService.getGeneratedReportByShortId(id))
      .subscribe({
        next: (res: GeneratedReport) => {
          if (res) {
            //ESTO VA A CAMBIAR; YA QUE PARA GENERAR REPORTE LUEGO SOLO ENVIAREMOS EL REPORTGENERATEDID.
            // NO NECESITARIAMOS TRAERNOS TODA ESTA INFO PARA EL REQUEST.
            this.requestReportData = this.getDataMapping(res);
            this.reportId = res.reportId;

            this.reportsLocalSub = this.reportsLocalLoader
              .load(this.reportsService.getReportsLocal(res.reportId))
              .subscribe({
                next: (resp: ReportsLocal[]) => {
                  this.selectedReport = resp[0];
                  console.log('selectedReport: ', this.selectedReport);
                  this.loadReport();
                },
                error: err => {
                  console.error('El reporte no existe o no tienes permisos.');
                  return this.router.navigate(['/nopage']);
                },
              });
          }
        },
        error: () => {
          return this.redirectToNoPage();
        },
      });
  }

  getDataMapping(data: GeneratedReport): MyReport {
    let myReport: MyReport = new MyReport();

    myReport.id = data.reportGeneratedId;

    myReport.shortId = data.shortId;
    myReport.style = data.reportStyleId;
    // myReport.culture
    myReport.baseId = data.baseId;
    myReport.subBaseId = data.subBaseId;
    myReport.individualIds = [data.individualId];
    myReport.hrFeedback = data.feedbackText;
    if (data.reportGeneratedJobs && data.reportGeneratedJobs.length > 0) {
      myReport.jobId = data.reportGeneratedJobs[0].jobId;
    }
    // myReport.jobCategoryId
    if (
      data.reportGeneratedCompetencies &&
      data.reportGeneratedCompetencies.length > 0
    ) {
      myReport.competenciesIds = data.reportGeneratedCompetencies.map(
        x => x.competencyId
      );
    }

    myReport.groupId = data.groupId;
    // myReport.groupIndividuals
    myReport.areaId = data.areaId;
    // myReport.areaIndividuals
    myReport.leaderIndividualId = data.leaderIndividualId;
    return myReport;
  }

  redirectToNoPage(): void {
    console.error('El reporte no existe o no tienes permisos.');
    // return this.router.navigate(['/nopage']);
    this.router.navigate(['/nopage']);
  }

  loadReportType(): void {
    if (!this.selectedReport) {
      this.selectedReport = JSON.parse(
        this.storeService.getData(StoreKeys.TYPE_REPORT) || null
      );
    }

    this.loadBackgroundImage();
    this.loadLogo();

    //Filtro las que no son del bloque 1
    this.selectReportType = {
      ...[
        ...listScreenByReport.filter(
          data =>
            data.groupReport === this.selectedReport.reportGroup.internalName &&
            data.reportType === this.selectedReport.reportType.internalName
        ),
      ][0],
    };

    this.selectReportType.screens = [
      ...this.selectReportType.screens.filter(data => data.block !== 1),
    ];
    console.warn(this.selectReportType.screens)
    //Filtro por bloque 1
    this.selectOnlyProfile = {
      ...[
        ...listScreenByReport.filter(
          data =>
            data.groupReport === this.selectedReport.reportGroup.internalName &&
            data.reportType === this.selectedReport.reportType.internalName
        ),
      ][0],
    };
    this.selectOnlyProfile.screens = [
      ...this.selectOnlyProfile.screens.filter(data => data.block === 1),
    ];
  }

  loadBackgroundImage(): void {
    //TODO: Luego actualizar codigo cuando tengamos las imagenes en png o svg
    if (this.selectedReport) {
      this.backgroundUserImage =
        'background-' + this.getBackgroundName();
    }
  }

  getBackgroundName(): string {
    let backgroundName: string = '';
    let names: string[] = this.selectedReport.reportType.internalName
      .split('_')
      .map(name => {
        return name.toLowerCase();
      });

    for (let i = 0; i < names.length; i++) {
      backgroundName += names[i] + (i + 1 < names.length ? '-' : '');
    }

    return backgroundName;
  }

  loadLogo(): void {
    //TODO:Cambiar logica porque es solo para visualizar logo
    if (
      this.selectedReport.reportGroup.name === 'hiring' &&
      this.selectedReport.reportType.name === 'survey'
    ) {
      this.logoImage = '/assets/img/logo.png';
    } else if (
      this.selectedReport.reportGroup.name === 'hiring' &&
      this.selectedReport.reportType.name === 'report'
    ) {
      this.logoImage = '/assets/img/logo-zurich.png';
    } else {
      this.logoImage = '/assets/img/logo-metlife.png';
    }
  }

  loadStyleReport(): void {}

  loadInvidualSections(): void {
    let baseRequest = this.getBodyRequest(
      this.requestReportData?.jobId ? [this.requestReportData?.jobId] : null,
      this.getAllSectionsReports()
    );

    this.reportsSub = this.individualsSectionsLoader
      .load(this.reportsService.loadIndividualReport(baseRequest))
      .subscribe((res: PDAIndividualSectionsResponse) => {
        this.dataIndividualSectionsResponse = res;
        this.setJobList();
      });
  }

  setJobList(): void {
    if (this.requestReportData.jobId) {
      this.getCategoryByJob();
    }
  }

  getJobsMapping(): string[] {
    return this.jobsByCategory?.reduce(
      (newValue: string[], currentValue: Job) => {
        newValue.push(currentValue.jobId);
        return newValue;
      },
      []
    );
  }

  getCategoryByJob(): void {
    //TODO: Solicitar unico endpoint para obtener info de la categoria
    const subsJobs = this.categoryByJobLoader
      .load(
        this.jobService.getJobs(
          this.requestReportData.jobId,
          null,
          null,
          null,
          null,
          1,
          70
        )
      )
      .subscribe({
        next: (response: GetJobsResponse) => {
          console.log('job: ', response.data);
          let category = response.data[0].jobCategoryId;
          this.jobCategoriesSub = this.jobCategoriesLoader
            .load(this.jobService.getJobCategories())
            .subscribe({
              next: (data: JobCategory[]) => {
                this.jobCategory = data.find(item => {
                  return item.jobCategoryId === category;
                });
              },
              error: err => {
                console.log('No se pudo obtener informacion de la categoria');
              },
            });
          this.getJobsByCategory(category);
        },
        error: err => {},
        complete: () => {
          subsJobs.unsubscribe();
        },
      });
  }

  getJobsByCategory(jobCategoryId: string): void {
    const subsJobs = this.jobsByCategoryLoader
      .load(
        this.jobService.getJobs(null, null, null, null, jobCategoryId, 1, 70)
      )
      .subscribe({
        next: (response: GetJobsResponse) => {
          console.log('jobs: ', response.data);
          this.jobsByCategory = response.data;
          this.jobsList = this.getJobsMapping();
          this.loadMultipleJobCompatibility(this.jobsList);
        },
        error: err => {},
        complete: () => {
          subsJobs.unsubscribe();
        },
      });
  }

  setJobCategory(): void {
    this.jobCategory = this.storeService.getData(StoreKeys.JOB_CATEGORY);
  }

  loadMultipleJobCompatibility(jobsId: string[]): void {
    let baseRequest = this.getBodyRequest(jobsId, ['JobCompatibility']);
    this.multipleJobCompatibilitySub = this.multipleJobCompatibilityLoader
      .load(this.reportsService.loadIndividualReport(baseRequest))
      .subscribe((res: PDAIndividualSectionsResponse) => {
        this.multipleJobCompatibility =
          res.jobCompatibility?.multipleJobCompatibility;
      });
  }

  loadGroupSections(): void {
    let baseRequest = this.getBodyGroupRequest();
    baseRequest.competencyParameters.competenciesId =
      this.requestReportData.competenciesIds;
    baseRequest.jobParameters.jobsId = [this.requestReportData.jobId];

    this.reportsGroupSub = this.reportsService
      .loadGroupReport(this.getBodyGroupRequest())
      .subscribe((res: PDAGroupSectionsResponse) => {});
  }

  getBodyRequest(
    jobIds: string[],
    listSectionsPDA: string[]
  ): PDAIndividualSectionsRequest {
    let pdaIndividualSectionsRequest: PDAIndividualSectionsRequest = {};
    pdaIndividualSectionsRequest.reportId = this.selectedReport.reportId;
    pdaIndividualSectionsRequest.baseId = this.requestReportData.baseId;
    pdaIndividualSectionsRequest.subbaseId = this.requestReportData.subBaseId;
    pdaIndividualSectionsRequest.individualId =
      this.requestReportData.individualIds[0];
    pdaIndividualSectionsRequest.sectionsReportPDA = listSectionsPDA;

    if (jobIds?.length > 0) {
      pdaIndividualSectionsRequest.jobParameters = {
        jobsId: jobIds,
        natural: true,
        includeAverage: false,
        includeCorrelationCompetency: true,
      };
    }
    if (this.requestReportData.competenciesIds?.length > 0) {
      pdaIndividualSectionsRequest.competencyParameters = {
        competenciesId: this.requestReportData.competenciesIds,
        natural: true,
      };
    }

    pdaIndividualSectionsRequest.includeGraphics = false;

    console.log('pdaIndividualSectionsRequest', pdaIndividualSectionsRequest);
    return pdaIndividualSectionsRequest;
  }

  getBodyGroupRequest(): PDAGroupSectionsRequest {
    return {
      reportId: '81D4C573-1AB5-4022-AE32-2333EBC8B1DE',
      baseId: this.requestReportData.baseId,
      subbaseId: this.requestReportData.subBaseId,
      leaderIndividualId: this.requestReportData.individualIds[0],
      individualsIds: this.requestReportData.individualIds,
      sectionsReportGroup: [
        'BehavioralRadarChart',
        'EffectiveLeadership',
        'KeyAspects',
        'KeysToMotivate',
        'ManagementStyle',
        'PredominantAxes',
        'ProfileModification',
        'ScatteringPercentages',
        'REPNSTrends',
        'BehavioralProfileChartAverage',
        'BehavioralRadarChartGroupAverage',
        'EnergyBalance',
        'CompetencyCompatibility',
        'JobCompatibility',
      ],
      jobParameters: {
        jobsId: [
          'F78ADDAB-D83A-471B-8E15-A07A9B09C62C',
          'E8907F50-2532-4222-A25A-4DA0734F2CE9',
          '03CA3E8C-0762-476C-9DC0-335AA3A5E5CD',
        ],
        natural: true,
      },
      competencyParameters: {
        competenciesId: [
          '9F1EB0E0-E34C-438A-9AF9-6A23D8337104',
          'F22293CE-E8C3-468E-8EF2-F8DA7AF12E49',
          '92B0AEAD-1DBC-4D2F-9155-FE0CA644D1B8',
        ],
        natural: true,
      },
      includeGraphics: false,
    };
  }

  //TODO: Luego borrar este codigo porque el tipo de estilo
  //se obtiene desde la funcionalidad de configuracion de reportes
  setColor(reportType: string): void {
    this.cssColorService.setColor('pda');
  }

  goToConfiguration(): void {
    this.reportsEventService.setCurrentReport(ReportEvent.NOT_REPORT);
    this.router.navigate(['/app']);
  }

  logout(): void {
    this.reportsEventService.setCurrentReport(ReportEvent.NOT_REPORT);
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
  }

  getAllSectionsReports(): string[] {
    return [
      'Introduction',
      'ConsistencyIndicator',
      'PDAChart',
      'BehavioralDescriptors',
      'BehavioralProfileDescription',
      'ManagementStyle',
      'SalesStyle',
      'EffectiveLeadership',
      'StrengthsOverused',
      'CurrentSituation',
      'BehavioralProfileChart',
      'SelfDescription',
      'RadarChart',
      'WheelChart',
      'BehavioralRadarChart',
      'BehavioralTrend',
      'JobCompatibility',
      'CompetencyCompatibility',
      'EmotionalIntelligence',
      'DevelopmentTips',
      'BehavioralProfileNaturalBrief',
      'BehavioralProfileImage',
      'DevelopmentPlan',
      'HRFeedback',
      'AudiovisualContent',
      'coverIndividual',
    ];
  }
}
