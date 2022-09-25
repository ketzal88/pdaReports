import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { VwGetAllIndividualWithBehaviouralProfile } from '../../../core/services/microservices/individual/individual.interface';
import { UserDetails } from '../../../core/services/microservices/identity/identity.interface';
import { StateLanguage } from '../../../core/consts/state-language.enum';
import { Subscription } from 'rxjs';
import { StepModel } from '../../../core/models/step.model';
import { LanguageService } from '../../../core/services/language.service';
import { StoreService } from '../../../core/services/store.service';
import { ModalService } from '../../../core/services/modal.service';
import { SendReportComponent } from './send-report/send-report.component';
import { PopUpMessage } from '../../../shared/components/display-message/displayMessage.interface';
import { DisplayMessageService } from '../../../core/services/displayMessage.service';
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

enum ReportType {
  HIRING_REPORT_FILTER = 'MY_REPORTS.HIRING_REPORT_FILTER',
  DEVELOP_REPORT_FILTER = 'MY_REPORTS.DEVELOP_REPORT_FILTER',
  HIRING_REVIEW_FILTER = 'MY_REPORTS.HIRING_REVIEW_FILTER',
  HIRING_SURVEY_FILTER = 'MY_REPORTS.HIRING_SURVEY_FILTER',
}

@Component({
  selector: 'app-my-reports',
  templateUrl: './my-reports.component.html',
  styleUrls: ['./my-reports.component.scss'],
})
export class MyReportsComponent implements OnInit, OnDestroy {
  //Inputs
  @Input() step!: StepModel;

  //Outputs
  @Output() selectedItem =
    new EventEmitter<VwGetAllIndividualWithBehaviouralProfile>();

  columns: TableColumn[] = [
    { columnDef: 'individualId', header: 'IndividualId', columnType: 'string' },
    { columnDef: 'firstName', header: 'FirstName', columnType: 'string' },
    { columnDef: 'lastName', header: 'LastName', columnType: 'string' },
    { columnDef: 'email', header: 'Email', columnType: 'string' },
    { columnDef: 'reportId', header: 'Report', columnType: 'string' },
    { columnDef: 'type', header: 'Type', columnType: 'string' },
    { columnDef: 'shortId', header: 'shortId', columnType: 'string' },
    { columnDef: 'creationDate', header: 'Date', columnType: 'date' },
  ];

  availableClients: TypeFilterItem[];
  selectedClientId: string;

  availableSubbases: TypeFilterItem[];
  selectedSubbaseId?: string = undefined;

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
    private displayMessageService: DisplayMessageService,
    private generatedReportsService: GeneratedReportsService
  ) {}
  ngOnInit(): void {
    this.initClientFilters();

    this.pageNumber = 1;
    this.totalSize = 0;
    this.generatedReportsLoader = new Loader();

    this.typeFilterList = []; //TODO: Pasar a un metodo utils
    const reportTypeFilters: TypeFilterItem[] = Object.keys(ReportType)
      .filter(k => typeof ReportType[k] === 'string')
      .map(filter => ({ key: filter, name: ReportType[filter] }));
    this.typeFilterList.push({
      key: 'MY_REPORTS.REPORT_TYPE_FILTER',
      name: 'Tipo de reporte',
      data: reportTypeFilters,
    });

    this.loadGeneratedReports();
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

    //console.log('onBaseChange-event', event);
    console.log('this.selectedClientId', this.selectedClientId);
    console.log('this.selectedSubbaseId', this.selectedSubbaseId);
  }

  ngOnDestroy(): void {
    unsubscribe(this.individualDataSub);
    unsubscribe(this.languageServiceSub);
  }

  loadGeneratedReports(): void {
    let request: GeneratedReportsRequest = {
      reportGeneratedId: null,
      reportId: null,
      reportTypeId: null,
      baseId: this.selectedClientId,
      subbaseId:
        this.selectedSubbaseId?.length > 5 ? this.selectedSubbaseId : undefined,
      individualId: null,
      areaId: null,
      firstName: null,
      lastName: null,
      email: null,
      filter:
        this.filterText.trim().length >= 0 ? this.filterText.trim() : null,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };

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
          this.languageService.setChangeStateLanguage(StateLanguage.CHANGED);
        },
        error: err => {
          this.dataSource = new MatTableDataSource<GeneratedReport>([]);
          console.log('error: ', err);
        },
      });
  }

  loadUserDetails(): void {
    this.userDetails = JSON.parse(this.storeService.getData('userDetails'));
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
        if (stateLanguage === StateLanguage.CHANGING) {
          this.pageNumber = 1;
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

  onSelectedChange(selected: any): void {
    this.storeService.setData('reportList', selected);
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
    const params = {
      width: '1000px',
      data: null,
    };
    this.modalService.openPopUp(SendReportComponent, params);
    this.modalService.confirmedPopUp().subscribe(data => {
      if (data) {
        this.loadModalConfirmation();
      }
    });
  }

  loadModalConfirmation(): void {
    let ret = new PopUpMessage('Envio de reporte');
    ret.description = 'Se envio correctamente.';
    ret.hasBackdrop = true;
    ret.disableClose = false;
    ret.closeOnNavigation = false;
    ret.closableOnlyWithButton = false;
    ret.backdropClass = '';
    this.displayMessageService.openPopUp(ret);
    this.displayMessageService.confirmedPopUp().subscribe(confirmed => {
      console.log('confirmed: ', confirmed);
      if (confirmed) {
        //TODO: Realiza alguna accion al cierre del modal
      }
    });
  }
}
