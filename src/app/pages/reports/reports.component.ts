import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
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
import { ReportEvent } from '../../core/consts/report-event.enum';
import {
  MultipleJobCompatibility,
  PDAIndividualSectionsResponse,
} from '../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { PDAGroupSectionsResponse } from '../../core/services/microservices/reports/interfaces/pdaGroupSectionsResponse.interface';
import { ReportsService } from '../../core/services/microservices/reports/reports.service';
import { PDAIndividualSectionsRequest } from '../../core/services/microservices/reports/interfaces/pdaIndividualSectionsRequest.interface';
import { PDAGroupSectionsRequest } from '../../core/services/microservices/reports/interfaces/pdaGroupSectionsRequest.interface';
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
import { JobService } from '../../core/services/microservices/job/job.service';
import { ReportResponseType } from 'src/app/core/consts/report-response-type.enum';
import { ResponseDialogComponent } from 'src/app/shared/components/modal/response-dialog/response-dialog.component';
import { ModalService } from '../../core/services/modal.service';
import { TypesInternalReports } from '../../core/consts/types-internal-reports.enum';
import { GeneratedReportByIdResponse } from '../../core/services/microservices/reports/interfaces/generatedReportsResponse.interface';
import { PdfGenerationComponent } from 'src/app/shared/components/modal/pdf-generation/pdf-generation.component';
import { SendReportService } from '../report-central/my-reports/send-report/send-report.service';
import { ClientService } from '../../core/services/microservices/client/client.service';
import { ClientResponse } from '../../core/services/microservices/client/client.interface';

import { environment } from 'src/environments/environment';
import 'anychart';
import { LoadingService } from '../../core/services/loading.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { MenuComponent } from 'src/app/shared/components/display-message/menu/menu.component';
import { StyleService } from '../../core/services/style/style.service';

anychart.licenseKey(environment.anyChart.licenseKey);

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit, OnDestroy, AfterViewInit {
  dataIndividualSectionsResponse!: PDAIndividualSectionsResponse;
  dataGroupSectionsResponse!: PDAGroupSectionsResponse;

  //bindings
  PropertyNames = PropertyNames;
  backgroundUserImage = null;
  logoImage = null;
  selectedReport: ReportsLocal = null;
  selectReportType: ConfigurationTypesReports;
  selectOnlyProfile: ConfigurationTypesReports;
  reportId: string;
  individualId: string;
  leaderIndividualId: string;
  TypesInternalReports = TypesInternalReports;
  orientationClass: string = null;

  //ViewChilds
  @ViewChild('checkStrengthsOverusedSection')
  checkStrengthsOverusedSection: ElementRef;

  //Variables
  firstTime: boolean = false;
  jobsByCategory: Job[];
  multipleJobCompatibility: MultipleJobCompatibility[];
  jobsIdList: string[];
  jobCategory: JobCategory;
  shortId: string;
  listReportsForEmails: GeneratedReport[];
  generatedReportByIdResponse: GeneratedReportByIdResponse;

  //Report Variables
  reportGeneratedId: string;
  reportJobId: string;

  //Subscriptions
  reportsSub!: Subscription;
  reportsGroupSub!: Subscription;
  multipleJobCompatibilitySub!: Subscription;
  generatedReportsSub: Subscription;
  reportsLocalSub: Subscription;
  jobCategoriesSub: Subscription;
  clientSub: Subscription;

  //Loader
  generatedReportsLoader: Loader;
  multipleJobCompatibilityLoader: Loader;
  jobsByCategoryLoader: Loader;
  individualsSectionsLoader: Loader;
  groupSectionsLoader: Loader;
  categoryByJobLoader: Loader;
  reportsLocalLoader: Loader;
  jobCategoriesLoader: Loader;
  logoLoader: Loader;

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
    private authenticationService: AuthenticationService,
    private generatedReportsService: GeneratedReportsService,
    private jobService: JobService,
    private modalService: ModalService,
    private sendReportService: SendReportService,
    private clientService: ClientService,
    private loadingService: LoadingService,
    private translateService: TranslateService,
    private matDialog: MatDialog,
    private styleService: StyleService
  ) {
    this.loadingService.setMessage(
      this.translateService.instant('REPORTS.LOADING_REPORT')
    );
  }

  ngOnInit(): void {
    this.listReportsForEmails = [];
    this.initLoader();
    this.shortId = this.route.snapshot.paramMap.get('id');
    this.getGeneratedReportById(this.shortId);
  }

  ngOnDestroy(): void {
    unsubscribe(this.reportsSub);
    unsubscribe(this.reportsGroupSub);
    unsubscribe(this.multipleJobCompatibilitySub);
    unsubscribe(this.generatedReportsSub);
    unsubscribe(this.reportsLocalSub);
    unsubscribe(this.jobCategoriesSub);
    unsubscribe(this.clientSub);
  }

  ngAfterViewInit(): void {
    //TODO: Revisar el error por consola Refused to apply style from
    this.styleService.loadStyle('assets/styles/night.css');
  }

  initLoader(): void {
    this.generatedReportsLoader = new Loader();
    this.multipleJobCompatibilityLoader = new Loader();
    this.jobsByCategoryLoader = new Loader();
    this.individualsSectionsLoader = new Loader();
    this.categoryByJobLoader = new Loader();
    this.reportsLocalLoader = new Loader();
    this.jobCategoriesLoader = new Loader();
    this.groupSectionsLoader = new Loader();
    this.logoLoader = new Loader();
  }

  loadReport(): void {
    this.loadReportTemplate();
    //this.loadStyleReport();
    this.cssColorService.loadColors();
    setTimeout(() => {
      this.reportsEventService.setCurrentReport(ReportEvent.IS_REPORT);
    }, 0);
  }

  getGeneratedReportById(id: string): void {
    this.generatedReportsSub = this.generatedReportsLoader
      .load(this.generatedReportsService.getGeneratedReportByShortId(id))
      .subscribe({
        next: (res: GeneratedReportByIdResponse) => {
          this.generatedReportByIdResponse = res;
          if (res) {
            this.getLogoClient();
            let newDataReport: GeneratedReport = {
              shortId: this.shortId,
              baseId: res.baseId,
              subBaseId: res.subBaseId,
            };
            this.listReportsForEmails.push(newDataReport);

            this.reportId = res.reportId;
            this.reportGeneratedId = res.reportGeneratedId;
            this.individualId = res.individualId;
            this.leaderIndividualId = res.leaderIndividualId;
            if (res.reportGeneratedJobs && res.reportGeneratedJobs.length > 0) {
              this.reportJobId = res.reportGeneratedJobs[0].jobId;
            }

            //Voy cargando la info de las secciones al mismo tiempo que cargo el reporte seleccionado.
            this.loadInvidualSections();

            if (this.leaderIndividualId) {
              this.loadGroupSections();
            }

            this.reportsLocalSub = this.reportsLocalLoader
              .load(this.reportsService.getReportsLocal(res.reportId))
              .subscribe({
                next: (resp: ReportsLocal[]) => {
                  this.selectedReport = resp[0];
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

  redirectToNoPage(): void {
    this.router.navigate(['/notAllowed']);
  }

  loadReportTemplate(): void {
    this.loadBackgroundImage();

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
      this.backgroundUserImage = 'background-' + this.getBackgroundName();
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

  //loadStyleReport(): void {}

  loadInvidualSections(): void {
    let baseRequest = this.getBodyRequest(
      this.reportGeneratedId,
      null,
      null //this.getIndividualsSections()
    );

    this.reportsSub = this.individualsSectionsLoader
      .load(this.reportsService.loadIndividualReport(baseRequest))
      .subscribe({
        next: (res: PDAIndividualSectionsResponse) => {
          this.dataIndividualSectionsResponse = res;
          this.setJobList();
        },
        error: () => {
          return this.handleErrorOrUnauthorized();
        },
      });
  }

  getIndividualsSections(): string[] {
    return ['LogosAndCertifications'];
  }

  setJobList(): void {
    if (this.reportJobId) {
      this.getCategoryByJob();
    }
  }

  getCategoryByJob(): void {
    //TODO: Solicitar unico endpoint para obtener info de la categoria
    const subsJobs = this.categoryByJobLoader
      .load(
        this.jobService.getJobs(this.reportJobId, null, null, null, null, 1, 2)
      )
      .subscribe({
        next: (response: GetJobsResponse) => {
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
          this.jobsByCategory = response.data;
          this.jobsIdList = response.data.map(x => x.jobId);
          this.loadMultipleJobCompatibility(this.jobsIdList);
        },
        error: err => {},
        complete: () => {
          subsJobs.unsubscribe();
        },
      });
  }

  loadMultipleJobCompatibility(jobsId: string[]): void {
    let baseRequest = this.getBodyRequest(this.reportGeneratedId, jobsId, [
      'JobCompatibility',
    ]);
    this.multipleJobCompatibilitySub = this.multipleJobCompatibilityLoader
      .load(this.reportsService.loadIndividualReport(baseRequest))
      .subscribe((res: PDAIndividualSectionsResponse) => {
        this.multipleJobCompatibility =
          res.jobCompatibility?.multipleJobCompatibility;
      });
  }

  getBodyRequest(
    reportGeneratedId: string,
    jobIds: string[],
    listSectionsPDA: string[]
  ): PDAIndividualSectionsRequest {
    let pdaIndividualSectionsRequest: PDAIndividualSectionsRequest = {};
    pdaIndividualSectionsRequest.reportGeneratedId = reportGeneratedId;
    pdaIndividualSectionsRequest.sectionsReportPDA = listSectionsPDA;

    if (jobIds?.length > 0) {
      pdaIndividualSectionsRequest.jobParameters = {
        jobsId: jobIds,
        natural: true,
        includeAverage: false,
        includeCorrelationCompetency: true,
      };
    }

    pdaIndividualSectionsRequest.includeGraphics = false;
    return pdaIndividualSectionsRequest;
  }

  loadGroupSections(): void {
    this.reportsGroupSub = this.groupSectionsLoader
      .load(this.reportsService.loadGroupReport(this.getBodyGroupRequest()))
      .subscribe((res: PDAGroupSectionsResponse) => {
        this.dataGroupSectionsResponse = res;
      });
  }

  getBodyGroupRequest(): PDAGroupSectionsRequest {
    return {
      reportId: this.reportId,
      reportGeneratedId: this.reportGeneratedId,
      leaderIndividualId: this.leaderIndividualId,
      individualsIds: [this.individualId],
      sectionsReportGroup: [
        'BehavioralRadarChart',
        // 'EffectiveLeadership',
        // 'KeyAspects',
        // 'KeysToMotivate',
        // 'ManagementStyle',
        // 'PredominantAxes',
        // 'ProfileModification',
        // 'ScatteringPercentages',
        'REPNSTrends',
        // 'BehavioralProfileChartAverage',
        'BehavioralRadarChartGroupAverage',
        // 'EnergyBalance',
        // 'CompetencyCompatibility',
        'JobCompatibility',
        'jobFromGroupCompatibility',
      ],
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

  downloadPDF(): void {
    this.modalService.openPopUp(PdfGenerationComponent, {
      width: '50%',
      data: {
        reportGeneratedId: this.reportGeneratedId,
      },
      panelClass: 'response-warning',
    });
  }

  logout(): void {
    this.reportsEventService.setCurrentReport(ReportEvent.NOT_REPORT);
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
  }

  handleErrorOrUnauthorized(): void {
    const type = ReportResponseType.ERROR;
    const message = [
      `CONFIGURATION.${type}.${ReportResponseType.ERROR_REPORT}`,
    ];

    this.modalService.openPopUp(ResponseDialogComponent, {
      width: '414px',
      data: {
        type,
        message,
      },
      panelClass: 'response-warning',
    });

    this.modalService.confirmedPopUp().subscribe((response: any) => {
      this.router.navigate(['notAllowed']);
    });
  }

  onSendReport(): void {
    this.sendReportService.onSendReport(
      this.listReportsForEmails[0].baseId,
      this.listReportsForEmails[0].subBaseId,
      this.listReportsForEmails
    );
  }

  getLogoClient(): void {
    this.clientSub = this.logoLoader
      .load(
        this.clientService.getClient(this.generatedReportByIdResponse?.baseId)
      )
      .subscribe({
        next: (data: ClientResponse) => {
          if (data && data?.logoReportPath) {
            //Guardar logo que viene del servicio
            this.logoImage = data.logoReportPath;
            let img = new Image();
            img.src = data.logoReportPath;

            if (img.naturalWidth > img.naturalHeight) {
              this.orientationClass = 'landscape';
            } else if (img.naturalWidth < img.naturalHeight) {
              this.orientationClass = 'portrait';
            }
          }
        },
        error: err => {
          console.log('error: ', err);
        },
      });
  }
  openMenu(): void {
    this.matDialog.open(MenuComponent);
  }
}
