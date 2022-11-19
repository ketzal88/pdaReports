import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserDetails } from '../../../core/services/microservices/identity/identity.interface';
import { StateLanguage } from '../../../core/consts/state-language.enum';
import { Subscription } from 'rxjs';
import { StepModel } from '../../../core/models/step.model';
import { LanguageService } from '../../../core/services/language.service';
import { StoreService } from '../../../core/services/store.service';
import { ModalService } from '../../../core/services/modal.service';
import { SendReportComponent } from './send-report/send-report.component';
import { TypeFilterItem } from '../../../shared/components/mat-custom-individuals-table/models/type-filter-item.interface';
import { TypeFilter } from '../../../shared/components/mat-custom-individuals-table/models/type-filter.interface';
import { TableColumn } from '../../../shared/components/mat-custom-individuals-table/models/tableColumn.interface';
import { GeneratedReportsService } from '../../../core/services/microservices/reports/generated-reports.service';
import { GeneratedReportsRequest } from '../../../core/services/microservices/reports/interfaces/generatedReportsRequest.interface';
import { unsubscribe } from 'src/app/core/utils/subscription.util';
import { Loader } from '../../../core/services/loader/loader';
import { StoreKeys } from '../../../core/consts/store-keys.enum';
import {
  GeneratedReportsResponse,
  GeneratedReport,
} from '../../../core/services/microservices/reports/interfaces/generatedReportsResponse.interface';
import {
  ReportsGroup,
  SelectedReport,
} from '../../../core/models/reportType.model';
import { TranslateService } from '@ngx-translate/core';
import { SendReportOptions } from './interfaces/send-report-options.interface';
import { ResponseDialogComponent } from '../../../shared/components/modal/response-dialog/response-dialog.component';
import { ReportResponseType } from '../../../core/consts/report-response-type.enum';
import { SendReportResponse } from './interfaces/send-report-response.interface';
import { Router } from '@angular/router';
import { SendReportService } from './send-report/send-report.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../../../shared/components/individuals/modal/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-my-reports',
  templateUrl: './my-reports.component.html',
  styleUrls: ['./my-reports.component.scss'],
})
export class MyReportsComponent implements OnInit, AfterViewInit, OnDestroy {
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
  madeRequest: boolean = false;

  availableSubbases: TypeFilterItem[];
  selectedSubbaseId?: string = undefined;

  availableAreas: TypeFilterItem[];
  selectedAreaId?: string = null;

  typeFilterList: TypeFilter[];
  typeFilterItemsSelected: TypeFilter[] = [];

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
    private router: Router,
    private sendReportService: SendReportService
  ) {}
  ngOnInit(): void {
    this.initColumns();
    this.initClientFilters();

    this.pageNumber = 1;
    this.totalSize = 0;
    this.generatedReportsLoader = new Loader();

    this.typeFilterList = [];

    this.listenLanguageChangeEvent();
  }

  ngAfterViewInit(): void {
    this.loadReportingFilterMapping();
  }

  initColumns(): void {
    this.columns = [
      {
        columnDef: 'firstName',
        header: this.translateService.instant(
          'MY_REPORTS.TABLE.COLUMN.FIRSTNAME'
        ),
        columnType: 'string',
      },
      {
        columnDef: 'lastName',
        header: this.translateService.instant(
          'MY_REPORTS.TABLE.COLUMN.LASTNAME'
        ),
        columnType: 'string',
      },
      {
        columnDef: 'email',
        header: this.translateService.instant('MY_REPORTS.TABLE.COLUMN.EMAIL'),
        columnType: 'string',
      },
      {
        columnDef: 'reportTypeId',
        header: this.translateService.instant('MY_REPORTS.TABLE.COLUMN.REPORT'),
        columnType: 'reportType',
      },
      {
        columnDef: 'creationDate',
        header: this.translateService.instant('MY_REPORTS.TABLE.COLUMN.DATE'),
        columnType: 'date',
      },
      {
        columnDef: 'shortId',
        header: this.translateService.instant('MY_REPORTS.TABLE.COLUMN.LINK'),
        columnType: 'reportLink',
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
      isTemplate: false,
    };

    this.madeRequest = true;
    this.generatedReportsSub = this.generatedReportsLoader
      .load(this.generatedReportsService.loadGeneratedReports(request))
      .subscribe({
        next: (res: GeneratedReportsResponse) => {
          if (res.data) {
            this.dataSource = new MatTableDataSource<GeneratedReport>(res.data);
            this.totalSize = res.totalRecords;
          } else {
            this.dataSource = new MatTableDataSource<GeneratedReport>([]);
            this.totalSize = 0;
          }
          this.data = res.data;
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

  onSendReport(): void {
    this.sendReportService.onSendReport(
      this.selectedClientId,
      this.selectedSubbaseId,
      this.reportList
    );
  }

  loadReportingFilterMapping(): void {
    for (let i = 0; i < this.typesReportsGroup.length; i++) {
      if (this.typesReportsGroup[i].internalName !== 'SALES') {
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
    }
  }

  onEditReportSetting(report: GeneratedReport): void {
    let selectedReport = this.getSelectedReport(report);

    this.storeService.setData(StoreKeys.MY_GENERATED_REPORT, report);
    this.storeService.setData(
      StoreKeys.TYPE_REPORT,
      JSON.stringify(selectedReport)
    );
    this.router.navigate(['/app/configuration']);
  }

  deleteReport(report: GeneratedReport): void {
    const dialogData: ConfirmDialogModel = {
      title: 'Eliminar reporte',
      message: '¿Esta seguro de eliminar el reporte?',
    };
    this.modalService.openPopUp(ConfirmDialogComponent, {
      width: '600px',
      closeOnNavigation: true,
      data: dialogData,
    });
    this.modalService.confirmedPopUp().subscribe((data: any) => {
      if (data) {
        this.generatedReportsService
          .deleteReport(report.reportGeneratedId)
          .subscribe((resp: any) => {
            if (resp.ok) {
              this.setSuccess(
                ['Reporte eliminado'],
                ReportResponseType.SUCCESS,
                'response-success'
              );
            } else {
              this.setError(
                [`No se pudo eliminar el reporte`],
                ReportResponseType.ERROR
              );
            }
          });
      }
    });
  }

  setSuccess(resultError: string[], type: string, panelClass: string): void {
    this.modalService.openPopUp(
      ResponseDialogComponent,
      this.modalService.getParams(resultError, type, panelClass)
    );

    this.modalService.confirmedPopUp().subscribe(() => {
      this.loadGeneratedReports();
    });
  }

  setError(message: string[], type: string): void {
    this.modalService.openPopUp(
      ResponseDialogComponent,
      this.modalService.getParams(message, type, 'response-error')
    );

    this.modalService.confirmedPopUp().subscribe(() => {});
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
}
