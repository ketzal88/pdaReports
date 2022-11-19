import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import {
  GeneratedReport,
  GeneratedReportsResponse,
} from '../../../core/services/microservices/reports/interfaces/generatedReportsResponse.interface';
import { StepModel } from '../../../core/models/step.model';
import {
  ReportsGroup,
  SelectedReport,
} from '../../../core/models/reportType.model';
import { TableColumn } from '../../../shared/components/mat-custom-individuals-table/models/tableColumn.interface';
import { Subscription } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Loader } from '../../../core/services/loader/loader';
import { MatTableDataSource } from '@angular/material/table';
import { UserDetails } from '../../../core/services/microservices/identity/identity.interface';
import { LanguageService } from '../../../core/services/language.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GeneratedReportsService } from '../../../core/services/microservices/reports/generated-reports.service';
import { StoreService } from '../../../core/services/store.service';
import { ModalService } from '../../../core/services/modal.service';
import { TypeFilterItem } from '../../../shared/components/mat-custom-individuals-table/models/type-filter-item.interface';
import { TypeFilter } from '../../../shared/components/mat-custom-individuals-table/models/type-filter.interface';
import { StoreKeys } from '../../../core/consts/store-keys.enum';
import { unsubscribe } from '../../../core/utils/subscription.util';
import { GeneratedReportsRequest } from '../../../core/services/microservices/reports/interfaces/generatedReportsRequest.interface';
import { StateLanguage } from '../../../core/consts/state-language.enum';
import { ResponseDialogComponent } from '../../../shared/components/modal/response-dialog/response-dialog.component';
import { ReportTypePickerComponent } from './modal/report-type-picker/report-type-picker.component';
import { TemplateConfiguration } from '../configuration/interfaces/template-configuration.interface';
import { ReportGeneratedRequest } from '../../../core/services/microservices/reports/interfaces/reportGeneratedRequest.interface';
import { InputDialogComponent } from './modal/input-dialog/input-dialog.component';
import { ConfirmDialogModel } from 'src/app/shared/components/individuals/modal/confirm-dialog/confirm-dialog.component';
import {
  DuplicateReportGeneratedRequest,
  DuplicateReportGeneratedResponse,
} from '../../../core/services/microservices/reports/interfaces/duplicateReportGenerated.interface';

@Component({
  selector: 'app-my-templates',
  templateUrl: './my-templates.component.html',
  styleUrls: ['./my-templates.component.scss'],
})
export class MyTemplatesComponent implements OnInit, AfterViewInit, OnDestroy {
  //Bindings

  //Variables
  stateLanguage: string;
  reportList: GeneratedReport[];

  //Inputs
  @Input() step!: StepModel;
  @Input() typesReportsGroup: ReportsGroup[] = null;

  columns: TableColumn[];

  availableClients: TypeFilterItem[];
  selectedClientId: string;

  availableSubbases: TypeFilterItem[];
  selectedSubbaseId?: string = undefined;

  availableAreas: TypeFilterItem[];
  selectedAreaId?: string = null;

  typeFilterList: TypeFilter[];
  typeFilterItemsSelected: TypeFilter[] = [];
  madeRequest: boolean = false;

  //Pagination
  pageSizeOptions = [5, 10, 25, 50];
  totalSize: number;
  pageSize: number = 10;
  pageNumber: number;
  //Pagination

  filterText: string = '';
  nothingFound: boolean = false;

  //ViewChilds
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Subcriptions
  individualDataSub!: Subscription;
  languageServiceSub!: Subscription;
  generatedReportsSub: Subscription;
  reportsSub: Subscription;

  //Loader
  generatedReportsLoader: Loader;

  dataSource: MatTableDataSource<GeneratedReport> =
    new MatTableDataSource<GeneratedReport>([]);

  data: GeneratedReport[];

  //UserDetails Info
  userDetails: UserDetails;

  constructor(
    private languageService: LanguageService,
    private storeService: StoreService,
    private modalService: ModalService,
    private generatedReportsService: GeneratedReportsService,
    private translateService: TranslateService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.initColumns();
    this.initClientFilters();

    this.pageNumber = 1;
    this.totalSize = 0;
    this.generatedReportsLoader = new Loader();

    this.typeFilterList = [];

    // if (this.selectedClientId && this.selectedSubbaseId) {
    //   this.loadGeneratedReports();
    // }
    this.listenLanguageChangeEvent();
  }

  ngAfterViewInit(): void {
    this.loadReportingFilterMapping();
  }

  initColumns(): void {
    this.columns = [
      {
        columnDef: 'name',
        header: this.translateService.instant('MY_TEMPLATES.TABLE.COLUMN.NAME'),
        columnType: 'string',
      },
      {
        columnDef: 'reportTypeId',
        header: this.translateService.instant(
          'MY_TEMPLATES.TABLE.COLUMN.REPORT'
        ),
        columnType: 'reportType',
      },
      {
        columnDef: 'creationDate',
        header: this.translateService.instant('MY_TEMPLATES.TABLE.COLUMN.DATE'),
        columnType: 'date',
      },
    ];
  }

  initClientFilters(): void {
    let savedSelectedBaseId = this.storeService.getData(
      StoreKeys.SELECTED_BASE_ID
    );
    let savedSelectedSubBaseId = this.storeService.getData(
      StoreKeys.SELECTED_SUBBASE_ID
    );

    if (savedSelectedBaseId) {
      this.selectedClientId = savedSelectedBaseId;
    }

    if (savedSelectedSubBaseId) {
      this.selectedSubbaseId = savedSelectedSubBaseId;
    }
  }

  ngOnDestroy(): void {
    unsubscribe(this.individualDataSub);
    unsubscribe(this.languageServiceSub);
  }

  loadGeneratedReports(): void {
    let request: GeneratedReportsRequest = {
      reportGeneratedId: null,
      reportId: null,
      reportTypeIds: this.getFilters(),
      baseId: this.selectedClientId,
      subbaseId:
        this.selectedSubbaseId?.length > 5 ? this.selectedSubbaseId : undefined,
      individualId: null,
      areaId: this.selectedAreaId,
      firstName: null,
      lastName: null,
      email: null,
      filter:
        this.filterText.trim().length >= 0 ? this.filterText.trim() : null,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      isTemplate: true,
    };
    this.madeRequest = true;
    this.generatedReportsSub = this.generatedReportsLoader
      .load(this.generatedReportsService.loadGeneratedReports(request))
      .subscribe({
        next: (res: GeneratedReportsResponse) => {
          if (res.data) {
            this.dataSource = new MatTableDataSource<GeneratedReport>(res.data);
            this.data = res.data;
            this.totalSize = res.totalRecords;
          } else {
            this.dataSource = new MatTableDataSource<GeneratedReport>([]);
          }
          this.stateLanguage === StateLanguage.CHANGING
            ? this.languageService.setChangeStateLanguage(StateLanguage.CHANGED)
            : null;
        },
        error: err => {
          this.dataSource = new MatTableDataSource<GeneratedReport>([]);
          console.log('error: ', err);
        },
      });
  }

  getFilters(): string[] {
    let filters: string[] = [];
    for (let i = 0; i < this.typeFilterItemsSelected.length; i++) {
      for (let j = 0; j < this.typeFilterItemsSelected[i].data.length; j++) {
        filters.push(this.typeFilterItemsSelected[i].data[j].key);
      }
    }

    return filters;
  }

  loadUserDetails(): void {
    this.userDetails = JSON.parse(
      this.storeService.getData(StoreKeys.USER_DETAILS)
    );
  }

  loadAvailableClients(): void {
    this.availableClients = this.userDetails.usersAccounts.map(account => ({
      key: account.base.baseId,
      name: account.base.link,
    }));

    this.availableClients = this.availableClients.filter(
      subbases => subbases.name.indexOf('.') === -1
    );
  }

  listenLanguageChangeEvent(): void {
    //Se subscribe para escuchar el evento y tomar alguna accion
    this.languageServiceSub = this.languageService
      .getCurrentStateLanguage()
      .subscribe(stateLanguage => {
        this.stateLanguage = stateLanguage;
        if (stateLanguage === StateLanguage.CHANGING) {
          this.loadGeneratedReports();
        }
      });
  }

  onFilterInput(event: string): void {
    this.filterText = event;
    this.loadGeneratedReports();
  }

  onPaginateChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.loadGeneratedReports();
  }

  onSelectedChange(selected: GeneratedReport[]): void {
    this.reportList = selected;
  }

  onFilters(event: TypeFilter[]): void {
    this.pageNumber = 1;
    this.typeFilterItemsSelected = event;
    this.loadGeneratedReports();
  }

  onSubbaseChange(selectedSubbaseId: string): void {
    this.selectedSubbaseId = selectedSubbaseId;
    this.loadGeneratedReports();
  }

  onAreaChange(selectedAreaId: string): void {
    this.selectedAreaId = selectedAreaId;
    this.loadGeneratedReports();
  }

  onBaseChange(selectedClientId: string): void {
    if (selectedClientId === this.selectedClientId) {
      return;
    }

    setTimeout(() => {
      this.selectedClientId = selectedClientId;
      this.selectedSubbaseId = null;
    });
  }

  completeStep(): void {
    this.step.isComplete = true;
  }

  incompleteStep(): void {
    this.step.isComplete = false;
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

  loadReportingFilterMapping(): void {
    for (let i = 0; i < this.typesReportsGroup.length; i++) {
      let typeFilterGroup = {
        key: this.typesReportsGroup[i].reportGroupId,
        name: this.typesReportsGroup[i].name,
        data: [],
      };
      let reportTypeFilter = this.typesReportsGroup[i].reportTypes.map(
        (data, index) => {
          return {
            key: data.id,
            name: data.name,
          };
        }
      );

      typeFilterGroup.data = [...reportTypeFilter];
      this.typeFilterList.push(typeFilterGroup);
    }

    this.typeFilterList.unshift({
      key: 'MY_REPORTS.REPORT_TYPE_FILTER',
      name: this.translateService.instant('MY_REPORTS.REPORT_TYPE_FILTER'),
      data: [],
    });
  }

  onEditReportSetting(report: GeneratedReport): void {
    const selectedReport = this.getSelectedReport(report);

    this.storeService.setData(StoreKeys.MY_GENERATED_REPORT, report);
    this.storeService.setData(
      StoreKeys.TYPE_REPORT,
      JSON.stringify(selectedReport)
    );

    const templateConfiguration: TemplateConfiguration = {
      isTemplate: true,
      templateCreation: false,
      templateCreationId: report.reportGeneratedId,
    };

    this.storeService.setData(
      StoreKeys.REPORT_TEMPLATE_CONFIGURATION,
      templateConfiguration
    );

    this.router.navigate(['/app/configuration']);
  }

  onDuplicateReportTemplate(report: GeneratedReport): void {
    const request: DuplicateReportGeneratedRequest = {
      userId: this.userDetails.userId,
      generatedReportId: report.reportGeneratedId,
      newIndividualIds: [],
      includeReportOwnerIndividual: false,
      subbaseId: this.selectedSubbaseId,
    };
    this.generatedReportsService
      .duplicateReport(request)
      .subscribe((resp: DuplicateReportGeneratedResponse[]) => {
        if (resp[0].ok) {
          this.loadGeneratedReports();
        }
      });
  }

  onRenameReportTemplate(report: GeneratedReport): void {
    const dialogData: ConfirmDialogModel = {
      title: 'Renombrar plantilla',
      message: 'Escoja el nuevo nombre de su plantilla',
      inputText: report.name,
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
          report.name = templateName;
          this.generatedReportsService
            .updateReport(report, report.reportGeneratedId)
            .subscribe((resp: any) => {
              console.log('Actualziar Nombre', resp);
            });
        }
      });
  }

  getSelectedReport(report: GeneratedReport): SelectedReport {
    let reportGroupFound: ReportsGroup = this.typesReportsGroup.filter(
      data =>
        data.reportTypes.filter(
          reportType => reportType.id === report.reportTypeId
        )[0]
    )[0];

    reportGroupFound.reportTypes = reportGroupFound.reportTypes.filter(
      c => c.id === report.reportTypeId
    );

    let selectedReport: SelectedReport = {
      reportGroup: {
        id: reportGroupFound.reportGroupId,
        internalName: reportGroupFound.internalName,
        name: reportGroupFound.name,
        order: reportGroupFound.order,
      },
      reportType: reportGroupFound.reportTypes[0],
      reportId: report.reportId,
    };

    return selectedReport;
  }

  showDefaultReportsPopUp(): void {
    this.modalService.openPopUp(ReportTypePickerComponent);

    this.modalService.confirmedPopUp().subscribe(() => {});
  }

  deleteTemplate(report: GeneratedReport): void {
    this.generatedReportsService
      .deleteReport(report.reportGeneratedId)
      .subscribe((resp: any) => {
        if (resp.ok) {
          this.loadGeneratedReports();
        }
      });
  }
}
