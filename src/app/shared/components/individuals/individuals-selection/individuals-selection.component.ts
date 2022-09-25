import {
  Component,
  ViewChild,
  OnDestroy,
  OnInit,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { IndividualService } from 'src/app/core/services/microservices/individual/individual.service';
import {
  GetAllIndividualWithBehaviouralProfileRequest,
  GetAllIndividualWithBehaviouralProfileResponse,
  VwGetAllIndividualWithBehaviouralProfile,
} from 'src/app/core/services/microservices/individual/individual.interface';
import { StateLanguage } from 'src/app/core/consts/state-language.enum';
import { TypeFilter } from 'src/app/shared/components/mat-custom-individuals-table/models/type-filter.interface';
import { TableColumn } from '../../mat-custom-individuals-table/models/tableColumn.interface';
import { LanguageService } from 'src/app/core/services/language.service';
import { StoreService } from 'src/app/core/services/store.service';
import { unsubscribe } from 'src/app/core/utils/subscription.util';
import { GroupingActions } from '../../../../core/consts/grouping-actions.enum';
import { Loader } from '../../../../core/services/loader/loader';
import { GenderResponse } from '../../../../core/services/microservices/individual/gender.interface';
import { StoreKeys } from '../../../../core/consts/store-keys.enum';

@Component({
  selector: 'app-individuals-selection',
  templateUrl: './individuals-selection.component.html',
  styleUrls: ['./individuals-selection.component.scss'],
})
export class IndividualsSelectionComponent implements OnInit, OnDestroy {
  //Inputs
  @Input() multipleSelection: boolean = false;
  @Input() maxMultipleSelection: number;

  @Input() lockedSelectId?: string;
  @Input() selectedClientId: string;
  @Input() selectedSubbaseId?: string = undefined;
  @Input() selectedAreaId?: string;
  @Input() selectedGroupingId?: string;
  @Input() selectedIndividualIds: string[] = [];
  @Input() selectedLeaderId: string;
  @Input() hasSelectLeader?: boolean = false;
  @Input() hasSelect: boolean = true;
  @Input() groupingAction: string;
  preselectedIds: string[];

  //Outputs
  @Output() selectedIndividualsEvent = new EventEmitter<
    VwGetAllIndividualWithBehaviouralProfile[] | null
  >();

  @Output() selectedLeaderIdEvent = new EventEmitter<string | null>();

  columns: TableColumn[] = [
    { columnDef: 'firstName', header: 'FirstName', columnType: 'string' },
    { columnDef: 'lastName', header: 'LastName', columnType: 'string' },
    { columnDef: 'email', header: 'Email', columnType: 'string' },
    { columnDef: 'genderText', header: 'Gender', columnType: 'gender' },
    {
      columnDef: 'behaviouralProfileName',
      header: 'BehavioralProfile',
      columnType: 'string',
    },
    {
      columnDef: 'consistencyText',
      header: 'PDAStatus',
      columnType: 'string',
    },
    { columnDef: 'date', header: 'Date', columnType: 'date' },
  ];

  @Input() typeFilterList: TypeFilter[];
  typeFilterItemsSelected: TypeFilter[] = [];

  //Pagination
  pageSizeOptions = [5, 10, 25, 50];
  totalSize: number = 0;
  @Input() pageSize: number = 10;
  pageNumber: number = 1;

  filterText: string = '';
  nothingFound: boolean = false;

  //ViewChilds
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Subcriptions
  individualDataSub!: Subscription;
  languageServiceSub!: Subscription;
  gendersSub: Subscription;

  //Loader
  gendersLoader: Loader;

  dataSource: MatTableDataSource<VwGetAllIndividualWithBehaviouralProfile> =
    new MatTableDataSource<VwGetAllIndividualWithBehaviouralProfile>([]);

  data: VwGetAllIndividualWithBehaviouralProfile[];

  //Variables
  genders: GenderResponse[] = [];

  //Bindings
  stateLanguage: string;

  constructor(
    private individualService: IndividualService,
    private cd: ChangeDetectorRef,
    private languageService: LanguageService,
    private storeService: StoreService
  ) {}
  ngOnInit(): void {
    this.gendersLoader = new Loader();
    this.preselectedIds = [];
    this.listenLanguageChangeEvent();
    this.pageNumber = 1;
    this.requestAndFillTable();
  }
  ngOnDestroy(): void {
    unsubscribe(this.individualDataSub);
    unsubscribe(this.languageServiceSub);
    unsubscribe(this.gendersSub);
  }

  listenLanguageChangeEvent(): void {
    //Se subscribe para escuchar el evento y tomar alguna accion
    this.languageServiceSub = this.languageService
      .getCurrentStateLanguage()
      .subscribe(stateLanguage => {
        this.stateLanguage = stateLanguage;
        if (this.stateLanguage === StateLanguage.CHANGING) {
          this.pageNumber = 1;
          this.requestAndFillTable();
        }
      });
  }

  onFilterInput(event: string): void {
    this.filterText = event;
    this.requestAndFillTable();
  }

  requestAndFillTable(): void {
    if (this.selectedClientId === undefined) {
      return;
    }

    this.nothingFound = false;
    this.individualDataSub = this.individualService
      .getAllIndividualsWithBehavioralProfile(this.getRequestAllIndividuals())
      .subscribe(
        (res: GetAllIndividualWithBehaviouralProfileResponse) => {
          if (!res) {
            this.totalSize = 0;
            this.dataSource =
              new MatTableDataSource<VwGetAllIndividualWithBehaviouralProfile>(
                []
              );
            this.nothingFound = true;
            return;
          } else {
            this.dataSource =
              new MatTableDataSource<VwGetAllIndividualWithBehaviouralProfile>(
                res.data
              );
            this.data = res.data;
            this.totalSize = res.totalRecords;

            //Cargo los datos preseleccionados de grupo o area si vienen de un modal
            if (this.groupingAction) {
              this.loadPreselectedIds(res.data);
            }
          }

          this.stateLanguage === StateLanguage.CHANGING
            ? this.languageService.setChangeStateLanguage(StateLanguage.CHANGED)
            : null;
        },
        error => {
          this.totalSize = 0;
          console.log('error: ', error);
          this.cd.markForCheck();
        }
      );
  }

  getRequestAllIndividuals(): GetAllIndividualWithBehaviouralProfileRequest {
    let request: GetAllIndividualWithBehaviouralProfileRequest = {
      baseId: this.selectedClientId,
      subbaseId:
        this.selectedSubbaseId?.length > 5 ? this.selectedSubbaseId : undefined,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      areaId:
        this.groupingAction === GroupingActions.EDIT ||
        this.groupingAction === GroupingActions.DUPLICATE
          ? null
          : this.selectedAreaId,
      groupingId:
        this.groupingAction === GroupingActions.EDIT ||
        this.groupingAction === GroupingActions.DUPLICATE
          ? null
          : this.selectedGroupingId,
      filter:
        this.filterText.trim().length >= 0 ? this.filterText.trim() : null,
    };

    if (this.typeFilterItemsSelected.length > 0) {
      this.typeFilterItemsSelected.forEach(filter => {
        const keys = filter.data.map(function (filterKey) {
          return filterKey.key;
        });
        if (filter.key === 'Consistency') {
          request.consistencyList = keys;
        }
        if (filter.key === 'Gender') {
          request.genderList = keys.map((key: string) => Number(key));
        }
      });
    }

    return request;
  }

  loadPreselectedIds(data: VwGetAllIndividualWithBehaviouralProfile[]): void {
    if (
      (this.selectedGroupingId || this.selectedAreaId) &&
      this.groupingAction === GroupingActions.VIEW
    ) {
      this.preselectedIds = data.map(data => {
        return data.individualId;
      });
      this.storeService.setData(StoreKeys.PRESELECTED_IDS, this.preselectedIds);
    } else {
      this.preselectedIds =
        this.storeService.getData(StoreKeys.PRESELECTED_IDS) || [];
    }
  }

  onPaginateChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.requestAndFillTable();
  }

  onSelectedIndividualsChange(selected: string[]): void {
    if (!this.multipleSelection) {
      let selectedIndividual = this.dataSource.filteredData.find(data => {
        return data.individualId === selected[0];
      });
      if (selectedIndividual) {
        this.selectedIndividualsEvent.emit([selectedIndividual]);
      } else {
        this.selectedIndividualsEvent.emit([]);
      }
    } else {
      let selectedIndividuals: VwGetAllIndividualWithBehaviouralProfile[] = [];
      selected.forEach(selectedIndividualId => {
        let selectedIndividual = this.dataSource.filteredData.find(
          (data, index) => {
            return data.individualId === selectedIndividualId;
          }
        );
        if (selectedIndividual) {
          selectedIndividuals.push(selectedIndividual);
        }
      });

      if (selectedIndividuals.length > 0) {
        this.selectedIndividualsEvent.emit(selectedIndividuals);
      } else {
        this.selectedIndividualsEvent.emit([]);
      }
    }
  }

  onSelectedLeaderChange(selectedId?: string | null): void {
    this.selectedLeaderIdEvent.emit(selectedId);
  }

  onFilters(event: TypeFilter[]): void {
    this.pageNumber = 1;
    this.typeFilterItemsSelected = event;
    this.requestAndFillTable();
  }
}
