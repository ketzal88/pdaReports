import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { StoreService } from 'src/app/core/services/store.service';
import { StepModel } from '../../../../core/models/step.model';
import { ModalService } from '../../../../core/services/modal.service';
import { IndividualAggrupationComponent } from '../../../../shared/components/individuals/modal/individual-aggrupation/individual-aggrupation.component';
import { GroupingActions } from '../../../../core/consts/grouping-actions.enum';
import { AggrupationData } from '../../../../shared/components/individuals/interfaces/aggrupation-data.interface';
import { GroupingService } from '../../../../core/services/microservices/individual/grouping.service';
import { catchError, combineLatest, Observable, of, Subscription } from 'rxjs';
import { unsubscribe } from '../../../../core/utils/subscription.util';
import {
  GroupAddRequest,
  GroupingIndividual,
  GroupingRequest,
  GroupingResponse,
} from '../../../../core/services/microservices/individual/grouping.interface';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../../../../shared/components/individuals/modal/confirm-dialog/confirm-dialog.component';
import { MatSelect } from '@angular/material/select';
import { StoreKeys } from '../../../../core/consts/store-keys.enum';
import { TypeFilter } from '../../../../shared/components/mat-custom-individuals-table/models/type-filter.interface';
import { Loader } from '../../../../core/services/loader/loader';
import { ReportResponseType } from '../../../../core/consts/report-response-type.enum';
import { ResponseDialogComponent } from '../../../../shared/components/modal/response-dialog/response-dialog.component';
import { GeneratedReportByIdResponse } from '../../../../core/services/microservices/reports/interfaces/generatedReportsResponse.interface';
import { getDifferenceBetweenArray } from '../../../../shared/utils/arrays.util';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-select-group',
  templateUrl: './select-group.component.html',
  styleUrls: ['./select-group.component.scss'],
})
export class SelectGroupComponent implements OnInit, OnDestroy {
  //Bindings
  selectedGroup: string;
  lockedSelectId: string;
  selectedIndividualIds: string[];
  loading: boolean = false;
  @Input() selectedGroupId: string;
  disableGrouping = environment.disableGrouping;

  //Inputs
  @Input() step!: StepModel;
  @Input() selectedClientId: string;
  @Input() selectedSubbaseId: string;
  @Input() typeFilterList: TypeFilter[];
  @Input() generatedReportByIdResponse: GeneratedReportByIdResponse;

  //Outputs
  @Output() selectedIndividualsOfGroupChange = new EventEmitter<string[]>();
  @Output() selectedGroupChange = new EventEmitter<string>();
  //Variables
  groups: GroupingResponse[];
  prevSelectedValue: string;
  preselectedIds: GroupingIndividual[];

  aggrupationData: AggrupationData;

  //Subscriptions
  groupingSub: Subscription;
  getGroupIndividualsSub: Subscription;
  updateRelationGroupIndividualsSub: Subscription;

  //Viewchilds
  @ViewChild('groupSelect') groupSelect: MatSelect;

  //Loaders
  addGroupIndividualLoader: Loader;
  deleteGroupIndividualLoader: Loader;

  constructor(
    private modalService: ModalService,
    private storeService: StoreService,
    private groupingService: GroupingService
  ) {}

  ngOnInit(): void {
    this.initLoaders();
    this.loadIndividualIds();
    if (this.selectedIndividualIds?.length > 0) {
      this.step.isComplete = true;
    } else {
      this.step.isComplete = false;
    }
    this.getGroups();
    this.loadLockedSelect();
  }

  ngOnDestroy(): void {
    unsubscribe(this.groupingSub);
    this.storeService.clearValue(StoreKeys.PRESELECTED_IDS);
  }

  initLoaders(): void {
    this.addGroupIndividualLoader = new Loader();
    this.deleteGroupIndividualLoader = new Loader();
  }

  loadIndividualIds(): void {
    let selectedIndividualdsFound: string[] = this.storeService.getData(
      StoreKeys.SELECTED_INDIVIDUALS_BY_GROUP
    );

    if (!selectedIndividualdsFound) {
      if (
        this.generatedReportByIdResponse &&
        this.generatedReportByIdResponse.reportGeneratedGroupingIndividuals &&
        this.generatedReportByIdResponse.reportGeneratedGroupingIndividuals
          .length > 0
      ) {
        this.selectedIndividualIds =
          this.generatedReportByIdResponse.reportGeneratedGroupingIndividuals.map(
            data => data.individualId
          );
        this.selectedIndividualsOfGroupChange.emit(this.selectedIndividualIds);
        this.loadAndSaveIndividualsByGroup();
      }
    } else {
      this.selectedIndividualIds = selectedIndividualdsFound;
      // this.loadAndSaveIndividualsByGroup();
    }
  }

  getGroups(): void {
    this.groupingSub = this.groupingService
      .getGroupings(this.getRequestGroup())
      .subscribe({
        next: (data: GroupingResponse[]) => {
          this.groups = [...data];
          //TODO: Eliminar variable cuando este definido el comportamiento para abrir el modal
          if (!this.disableGrouping) {
            this.groups.unshift({
              groupingId: 'NEW',
              name: 'Nuevo grupo',
              baseId: null,
              subBaseId: null,
              creationDate: null,
              deletionDate: null,
            });
            this.groups.push({
              groupingId: 'ALL',
              name: 'TODOS',
              baseId: null,
              subBaseId: null,
              creationDate: null,
              deletionDate: null,
            });
          }

          this.loadSelectGroup();
        },
      });
  }

  loadPreselectIds(): void {
    this.getGroupIndividualsSub = this.groupingService
      .getGroupingIndividuals(this.selectedGroup)
      .subscribe({
        next: (resp: GroupingIndividual[]) => {
          this.preselectedIds = resp;
          //Abro modal de agrupamiento
          this.openModalGroup();
        },
        error: err => {
          console.log(
            'No se pudo cargar los individuos. Intente nuevamente: ',
            err
          );
        },
      });
  }

  getRequestGroup(): GroupingRequest {
    return {
      groupingId:
        this.selectedGroup &&
        this.aggrupationData &&
        (this.aggrupationData?.action === GroupingActions.DELETE ||
          this.aggrupationData?.action === GroupingActions.VIEW)
          ? this.selectedGroup
          : null,
      name: null,
      baseId: this.selectedClientId,
      subBaseId: this.selectedSubbaseId,
    };
  }

  initSelectGroup(): void {
    this.selectedGroup = this.selectedGroup
      ? this.selectedGroup
      : this.groups[1].groupingId;
    this.prevSelectedValue = this.selectedGroup;
    this.selectedGroupChange.emit(this.selectedGroup);
  }

  loadSelectGroup(): void {
    let selectedGroup = this.storeService.getData(StoreKeys.SELECTED_GROUP_ID);

    //Consulta area previamente seleccionada, ya sea en un paso previo o bien del reporte generado.
    //Si no existe el area, cargo la primera area de la lista de areas
    if (!selectedGroup) {
      if (
        this.generatedReportByIdResponse &&
        this.generatedReportByIdResponse.areaId
      ) {
        this.selectedGroup = this.generatedReportByIdResponse.groupId;
      } else {
        this.selectedGroup = this.groups[1].groupingId;
      }
      this.storeService.setData(
        StoreKeys.SELECTED_GROUP_ID,
        this.selectedGroup
      );
    } else {
      this.selectedGroup = selectedGroup;
    }

    this.prevSelectedValue = this.selectedGroup;
    this.selectedGroupChange.emit(this.selectedGroup);
  }

  loadLockedSelect(): void {
    const selectedIndividuals: string[] = this.storeService.getData(
      StoreKeys.SELECTED_INDIVIDUALS
    );

    if (selectedIndividuals && selectedIndividuals.length === 1) {
      this.lockedSelectId = selectedIndividuals[0];
    }
  }

  onIndividualsSelection(selectedIndividualIds: string[]): void {
    this.selectedIndividualIds = selectedIndividualIds;
    this.selectedIndividualsOfGroupChange.emit(this.selectedIndividualIds);
    this.loadAndSaveIndividualsByGroup();
  }

  loadAndSaveIndividualsByGroup(): void {
    this.storeService.setData(
      StoreKeys.SELECTED_INDIVIDUALS_BY_GROUP,
      this.selectedIndividualIds
    );

    if (this.selectedIndividualIds.length > 0) {
      this.completeStep();
    } else {
      this.incompleteStep();
    }
  }

  onGroupChange(opened: boolean): void {
    if (!opened && this.selectedGroup && this.groupSelect.focused) {
      //TODO: Eliminar variable cuando este definido el comportamiento para abrir el modal
      if (this.disableGrouping) {
        // this.storeService.clearValue(
        //   StoreKeys.SELECTED_INDIVIDUALS_BY_GROUP
        // );
        // this.selectedGroup = aggrupationData.id;
        this.prevSelectedValue = this.selectedGroup;
        this.storeService.setData(
          StoreKeys.SELECTED_GROUP_ID,
          this.selectedGroup
        );
        this.selectedGroupChange.emit(this.selectedGroup);
      } else {
        if (this.selectedGroup !== 'ALL') {
          //Cargo previamente todos los individuos del grupo si no es nuevo
          if (this.selectedGroup !== GroupingActions.NEW) {
            this.selectedIndividualIds = [];
            this.loadPreselectIds();
          } else {
            this.openModalGroup();
          }
        }
      }
    }
  }

  openModalGroup(): void {
    this.modalService.openPopUp(
      IndividualAggrupationComponent,
      this.getParams()
    );
    this.loading = true;

    this.modalService
      .confirmedPopUp()
      .subscribe((aggrupationData: AggrupationData) => {
        if (aggrupationData) {
          this.aggrupationData = aggrupationData;
          if (aggrupationData.action === GroupingActions.NEW) {
            this.createGroup(this.aggrupationData);
          } else if (aggrupationData.action === GroupingActions.VIEW) {
            this.storeService.clearValue(
              StoreKeys.SELECTED_INDIVIDUALS_BY_GROUP
            );
            this.selectedGroup = aggrupationData.id;
            this.prevSelectedValue = this.selectedGroup;
            this.storeService.setData(
              StoreKeys.SELECTED_GROUP_ID,
              this.selectedGroup
            );
            this.selectedGroupChange.emit(this.selectedGroup);
            this.loading = false;
          } else if (
            aggrupationData.action === GroupingActions.EDIT ||
            aggrupationData.action === GroupingActions.DUPLICATE
          ) {
            this.openModalUpdate();
          } else if (aggrupationData.action === GroupingActions.DELETE) {
            this.openModalConfirmation();
          }
        } else {
          this.selectedGroup = this.prevSelectedValue;

          this.aggrupationData = null;
          this.loading = false;
        }
      });
  }

  createGroup(aggrupation: AggrupationData): void {
    let request: GroupAddRequest = {
      groupingId: aggrupation.id,
      name: aggrupation.inputAggrupation,
      baseId: this.selectedClientId,
      subBaseId: this.selectedSubbaseId,
      individualIds: aggrupation.selectedIndividuals,
    };

    this.groupingSub = this.groupingService.addGrouping(request).subscribe({
      next: data => {
        this.selectedGroup = aggrupation.id;
        this.aggrupationData = null;
        this.getGroups();
        this.loading = false;
        this.storeService.clearValue(StoreKeys.PRESELECTED_IDS);
      },
      error: err => {
        console.log('error: ', err);
      },
    });
  }

  createIndividualsInGroup(
    groupingId: string,
    selectedIndividuals: string[]
  ): void {
    this.groupingSub = this.groupingService
      .addGroupingIndividual(groupingId, selectedIndividuals)
      .subscribe({
        next: data => {
          this.getGroups();
          this.loading = false;
        },
        error: err => {
          console.log('error al crear los individuos para el grupo: ', err);
        },
      });
  }

  openModalUpdate(): void {
    this.loading = true;
    this.modalService.openPopUp(
      IndividualAggrupationComponent,
      this.getParams()
    );
    this.modalService.confirmedPopUp().subscribe((data: AggrupationData) => {
      if (data) {
        this.aggrupationData = data;
        if (data.action === GroupingActions.EDIT) {
          this.editGroup(this.aggrupationData);
        } else if (data.action === GroupingActions.DUPLICATE) {
          this.createGroup(this.aggrupationData);
        }
      } else {
        this.aggrupationData.action = GroupingActions.VIEW;
        this.openModalGroup();
      }
    });
  }

  editGroup(aggrupation: AggrupationData): void {
    let request: GroupAddRequest = {
      groupingId: aggrupation.id,
      name: aggrupation.inputAggrupation,
      baseId: this.selectedClientId,
      subBaseId: this.selectedSubbaseId,
    };
    this.groupingSub = this.groupingService
      .updateGrouping(aggrupation.id, request)
      .subscribe({
        next: data => {
          this.updateRelationshipGroupAndIndividuals(
            aggrupation.id,
            aggrupation.selectedIndividuals
          );
        },
        error: err => {
          console.log('error al editar grupo: ', err);
        },
      });
  }

  updateRelationshipGroupAndIndividuals(
    groupId: string,
    selectedIndividuals: string[]
  ): void {
    let obs: Array<Observable<any>> = this.loadObsRequest(
      groupId,
      selectedIndividuals
    );

    if (obs.length > 0) {
      this.updateRelationGroupIndividualsSub = combineLatest(...obs)
        .pipe()
        .subscribe({
          next: (response: (any | any)[]) => {
            if (
              response.some(value =>
                [
                  'ERROR_ADD_GROUP_INDIVIDUAL',
                  'ERROR_DELETE_GROUP_INDIVIDUAL',
                ].includes(value)
              )
            ) {
              this.loadErrors(response);
            } else {
              this.getGroups();
              this.loading = false;
              this.aggrupationData = null;
            }
          },
          error: (err: Error) => {},
          complete: () => {},
        });
    }
  }

  loadObsRequest(
    groupId: string,
    selectedIndividuals: string[]
  ): Array<Observable<any>> {
    let newIndividuals = [];

    //Busco los nuevos individuos a agregar
    newIndividuals = getDifferenceBetweenArray(
      selectedIndividuals,
      this.preselectedIds.map(data => data.individualId)
    );

    let oldIndividuals = [];
    oldIndividuals = getDifferenceBetweenArray(
      this.preselectedIds.map(data => data.individualId),
      selectedIndividuals
    );

    let obs: Array<Observable<any>> = [];
    if (newIndividuals.length > 0) {
      obs.push(this.addGroupingIndividual(groupId, newIndividuals));
    }
    if (oldIndividuals.length > 0) {
      let deleteGroupIndividualList = this.preselectedIds.filter(data =>
        oldIndividuals.includes(data.individualId)
      );

      obs.push(
        this.deleteGroupingIndividual(
          groupId,
          deleteGroupIndividualList.map(data => data.individualId)
        )
      );
    }

    return obs;
  }

  loadErrors(response: string[]): void {
    let resultError: string[] = [];

    for (let i = 0; i < response.length; i++) {
      if (
        response[i] === 'ERROR_ADD_GROUP_INDIVIDUAL' ||
        response[i] === 'ERROR_DELETE_GROUP_INDIVIDUAL'
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
      this.getParamsMessage(resultError, type, panelClass)
    );

    let timer = setInterval(() => {
      clearInterval(timer);
      timer = null;
      this.modalService.dialogRef.close(true);
    }, 3000);

    this.modalService.confirmedPopUp().subscribe((response: any) => {
      if (timer) {
        clearInterval(timer);
      }
    });
  }

  getParamsMessage(message: string[], type: string, panelClass: string): any {
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

  addGroupingIndividual(
    groupId: string,
    individuals: string[]
  ): Observable<string> {
    return this.addGroupIndividualLoader
      .load(this.groupingService.addGroupingIndividual(groupId, individuals))
      .pipe(
        catchError(error => {
          console.log('error: ', error);
          return of('ERROR_ADD_AREA_INDIVIDUAL');
        })
      );
  }

  deleteGroupingIndividual(areaId: string, individuals: string[]): any {
    return this.deleteGroupIndividualLoader
      .load(this.groupingService.deleteGroupingIndividual(areaId, individuals))
      .pipe(
        catchError(error => {
          console.log('error: ', error);
          return of('ERROR_DELETE_AREA_INDIVIDUAL');
        })
      );
  }

  openModalConfirmation(): void {
    const dialogData: ConfirmDialogModel = {
      title: 'Eliminar el grupo',
      message: '¿Desea eliminar el grupo?',
    };
    this.modalService.openPopUp(ConfirmDialogComponent, {
      width: '600px',
      data: dialogData,
    });
    this.modalService.confirmedPopUp().subscribe((data: any) => {
      if (data) {
        this.deleteGroup();
      } else {
        this.aggrupationData.action = GroupingActions.VIEW;
        this.openModalGroup();
      }
    });
  }

  deleteGroup(): void {
    this.groupingSub = this.groupingService
      .deleteGrouping(this.aggrupationData.id)
      .subscribe({
        next: data => {
          this.selectedGroup = null;
          this.aggrupationData = null;
          this.getGroups();
          this.loading = false;
        },
        error: err => {
          console.log('error: ', err);
        },
      });
  }

  getParams(): any {
    const group = this.groups.find(
      data => data.groupingId === this.selectedGroup
    );

    const params = {
      width: '1000px',
      data: {
        aggrupation: {
          id: group.groupingId === 'NEW' ? null : group.groupingId,
          name: group.name,
        },
        type: 'GROUP',
        action: this.getAction(),
        typeFilterList: this.typeFilterList,
        selectedClientId: this.selectedClientId,
        selectedSubbaseId: this.selectedSubbaseId,
        preselectedIds: this.preselectedIds?.map(data => data.individualId),
      },
    };
    return params;
  }

  getAction(): string {
    let value: string;
    if (this.selectedGroup === GroupingActions.NEW) {
      value = GroupingActions.NEW;
    } else {
      value = this.aggrupationData
        ? this.aggrupationData.action
        : GroupingActions.VIEW;
    }
    return value;
  }

  completeStep(): void {
    this.step.isComplete = true;
  }

  incompleteStep(): void {
    this.step.isComplete = false;
  }
}
