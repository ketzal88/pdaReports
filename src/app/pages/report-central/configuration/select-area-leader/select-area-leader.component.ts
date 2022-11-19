import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { GroupingActions } from 'src/app/core/consts/grouping-actions.enum';
import { StepModel } from 'src/app/core/models/step.model';
import { ModalService } from 'src/app/core/services/modal.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from 'src/app/shared/components/individuals/modal/confirm-dialog/confirm-dialog.component';
import { IndividualAggrupationComponent } from 'src/app/shared/components/individuals/modal/individual-aggrupation/individual-aggrupation.component';
import { StoreService } from '../../../../core/services/store.service';
import { AreaService } from '../../../../core/services/microservices/individual/area.service';
import { catchError, of, Subscription, Observable, combineLatest } from 'rxjs';
import {
  AreaAddRequest,
  AreaIndividual,
  AreaRequest,
  AreaResponse,
} from '../../../../core/services/microservices/individual/area.interface';
import { AggrupationData } from 'src/app/shared/components/individuals/interfaces/aggrupation-data.interface';
import { MatSelect } from '@angular/material/select';
import { StoreKeys } from '../../../../core/consts/store-keys.enum';
import { TypeFilter } from '../../../../shared/components/mat-custom-individuals-table/models/type-filter.interface';
import { unsubscribe } from '../../../../core/utils/subscription.util';
import { Loader } from '../../../../core/services/loader/loader';
import { ReportResponseType } from '../../../../core/consts/report-response-type.enum';
import { ResponseDialogComponent } from '../../../../shared/components/modal/response-dialog/response-dialog.component';
import { GeneratedReportByIdResponse } from '../../../../core/services/microservices/reports/interfaces/generatedReportsResponse.interface';
import { getDifferenceBetweenArray } from '../../../../shared/utils/arrays.util';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-select-area-leader',
  templateUrl: './select-area-leader.component.html',
  styleUrls: ['./select-area-leader.component.scss'],
})
export class SelectAreaLeaderComponent implements OnInit, OnDestroy {
  //Bindings
  selectedValue: string;

  //Inputs
  @Input() step!: StepModel;
  @Input() multipleSelection: boolean = false;
  @Input() maxMultipleSelection: number = 20;

  @Input() lockedSelectId?: string;
  @Input() selectedClientId: string;
  @Input() selectedSubbaseId: string;

  @Input() selectedAreaId?: string;
  @Input() typeFilterList: TypeFilter[];
  @Input() generatedReportByIdResponse: GeneratedReportByIdResponse;

  selectedAreaIndividualsIds?: string[];
  selectedAreaIndividualLeaderId?: string;
  prevSelectedValue: string;
  loading: boolean = false;

  //Outputs
  @Output() selectedAreaIndividualsIdsEvent = new EventEmitter<string[]>();
  @Output() selectedAreaIndividualLeaderIdEvent = new EventEmitter<string>();
  @Output() selectedAreaChange = new EventEmitter<string>();

  //Variables
  areas: AreaResponse[];
  preselectedIds: AreaIndividual[];
  disableGrouping = environment.disableGrouping;

  aggrupationData: AggrupationData;

  //Viewchilds
  @ViewChild('areaSelect') areaSelect: MatSelect;

  //Subscriptions
  areaSub: Subscription;
  updateRelationAreaIndividualsSub: Subscription;
  deleteRelationAreaIndividualsSub: Subscription;
  getAreaIndividualsSub: Subscription;

  //Loaders
  addAreaIndividualLoader: Loader;
  deleteAreaIndividualLoader: Loader;

  constructor(
    private storeService: StoreService,
    private modalService: ModalService,
    private areaService: AreaService
  ) {}

  ngOnInit(): void {
    this.initLoaders();
    this.loadIndividualIds();
    this.getAreas();
    this.loadLockedSelect();
  }

  ngOnDestroy(): void {
    unsubscribe(this.areaSub);
    unsubscribe(this.getAreaIndividualsSub);
    this.storeService.clearValue(StoreKeys.PRESELECTED_IDS);
  }

  initLoaders(): void {
    this.addAreaIndividualLoader = new Loader();
    this.deleteAreaIndividualLoader = new Loader();
  }

  loadIndividualIds(): void {
    const selectedIndividualsIdsFound: string[] = this.storeService.getData(
      StoreKeys.SELECTED_INDIVIDUALS_IDS_BY_AREA
    );
    const selectedIndividualLeaderIdFound: string = this.storeService.getData(
      StoreKeys.SELECTED_LEADER_ID_BY_AREA
    );

    if (
      selectedIndividualsIdsFound &&
      selectedIndividualsIdsFound.length > 0 &&
      selectedIndividualLeaderIdFound
    ) {
      this.selectedAreaIndividualsIds = selectedIndividualsIdsFound;
      this.selectedAreaIndividualLeaderId = selectedIndividualLeaderIdFound;
    } else if (
      this.generatedReportByIdResponse &&
      this.generatedReportByIdResponse.reportGeneratedAreaIndividuals.length > 0
    ) {
      this.selectedAreaIndividualsIds =
        this.generatedReportByIdResponse.reportGeneratedAreaIndividuals.map(
          data => data.individualId
        );
      this.selectedAreaIndividualLeaderId =
        this.generatedReportByIdResponse?.leaderIndividualId;
      this.selectedAreaIndividualsIdsEvent.emit(
        this.selectedAreaIndividualsIds
      );
      this.selectedAreaIndividualLeaderIdEvent.emit(
        this.selectedAreaIndividualLeaderId
      );
    }
    this.checkAndComplete();
  }

  loadLockedSelect(): void {
    const selectedIndividuals: string[] = this.storeService.getData(
      StoreKeys.SELECTED_INDIVIDUALS
    );

    if (selectedIndividuals && selectedIndividuals.length === 1) {
      this.lockedSelectId = selectedIndividuals[0];
    } else if (
      this.generatedReportByIdResponse?.individualId &&
      this.generatedReportByIdResponse?.individualId.length === 1
    ) {
      this.lockedSelectId = this.generatedReportByIdResponse.individualId;
    }
  }

  onAreaChange(opened: boolean): void {
    if (!opened && this.selectedAreaId && this.areaSelect.focused) {
      //TODO: Eliminar variable cuando este definido el comportamiento para abrir el modal
      if (this.disableGrouping) {
        // this.storeService.clearValue(
        //   StoreKeys.SELECTED_INDIVIDUALS_IDS_BY_AREA
        // );
        // this.selectedAreaId = aggrupationData.id;
        this.prevSelectedValue = this.selectedAreaId;
        this.storeService.setData(
          StoreKeys.SELECTED_AREA_ID,
          this.selectedAreaId
        );
        this.selectedAreaChange.emit(this.selectedAreaId);
      } else {
        if (this.selectedAreaId !== 'ALL') {
          //Cargo previamente todos los individuos del grupo si no es nuevo
          if (this.selectedAreaId !== GroupingActions.NEW) {
            this.loadPreselectIds();
            this.selectedAreaIndividualsIds = [];
          } else {
            this.openModalArea();
          }
        }
      }
    }
  }

  getAreas(): void {
    this.areaSub = this.areaService.getAreas(this.getAreaRequest()).subscribe({
      next: (data: AreaResponse[]) => {
        this.areas = [...data];
        //TODO: Eliminar variable cuando este definido el comportamiento para abrir el modal
        if (!this.disableGrouping) {
          this.areas.unshift({
            areaId: 'NEW',
            name: 'Nueva Area',
            baseId: null,
            subBaseId: null,
            creationDate: null,
            deletionDate: null,
          });
          this.areas.push({
            areaId: 'ALL',
            name: 'TODOS',
            baseId: null,
            subBaseId: null,
            creationDate: null,
            deletionDate: null,
          });
        }

        this.loadSelectArea();
      },
    });
  }

  loadSelectArea(): void {
    let selectedAreadId = this.storeService.getData(StoreKeys.SELECTED_AREA_ID);

    //Consulta area previamente seleccionada, ya sea en un paso previo o bien del reporte generado.
    //Si no existe el area, cargo la primera area de la lista de areas
    if (!selectedAreadId) {
      if (
        this.generatedReportByIdResponse &&
        this.generatedReportByIdResponse.areaId
      ) {
        this.selectedAreaId = this.generatedReportByIdResponse.areaId;
      } else {
        this.selectedAreaId = this.areas[1].areaId;
      }
      this.storeService.setData(
        StoreKeys.SELECTED_AREA_ID,
        this.selectedAreaId
      );
    } else {
      this.selectedAreaId = selectedAreadId;
    }

    this.prevSelectedValue = this.selectedAreaId;
    this.selectedAreaChange.emit(this.selectedAreaId);
  }

  loadPreselectIds(): void {
    this.getAreaIndividualsSub = this.areaService
      .getAreaIndividuals(this.selectedAreaId)
      .subscribe({
        next: (resp: AreaIndividual[]) => {
          this.preselectedIds = resp;
          this.openModalArea();
        },
        error: err => {
          console.log(
            'No se pudo cargar los individuos. Intente nuevamente: ',
            err
          );
        },
      });
  }

  getAreaRequest(): AreaRequest {
    return {
      areaId:
        this.selectedAreaId &&
        this.aggrupationData &&
        (this.aggrupationData?.action === GroupingActions.DELETE ||
          this.aggrupationData?.action === GroupingActions.VIEW)
          ? this.selectedAreaId
          : null,
      name: null,
      baseId: this.selectedClientId,
      subBaseId: this.selectedSubbaseId,
    };
  }

  getParams(): any {
    const area = this.areas.find(data => data.areaId === this.selectedAreaId);

    const preselectedIds = this.preselectedIds
      ? this.preselectedIds.map(data => data.individualId)
      : null;

    const params = {
      width: '1000px',
      data: {
        aggrupation: {
          id: area.areaId === 'NEW' ? null : area.areaId,
          name: area.name,
        },
        type: 'AREA',
        action: this.getAction(),
        typeFilterList: this.typeFilterList,
        selectedClientId: this.selectedClientId,
        selectedSubbaseId: this.selectedSubbaseId,
        preselectedIds: preselectedIds,
      },
    };
    return params;
  }

  getLabel(): string {
    let labelTranslate: string = '';
    if (this.selectedValue === 'NEW_GROUPING') {
      labelTranslate = 'NEW_AREA';
    } else {
      labelTranslate = 'AREA';
    }
    return labelTranslate;
  }

  getAction(): string {
    let value: string;
    if (this.selectedAreaId === GroupingActions.NEW) {
      value = GroupingActions.NEW;
    } else {
      value = this.aggrupationData
        ? this.aggrupationData.action
        : GroupingActions.VIEW;
    }
    return value;
  }

  onSelectedIndividuals(selectedIndividuals: string[]): void {
    if (selectedIndividuals) {
      this.selectedAreaIndividualsIds = selectedIndividuals;
      this.selectedAreaIndividualsIdsEvent.emit(
        this.selectedAreaIndividualsIds
      );
    }
    this.checkAndComplete();
  }

  onSelectedLeader(event: string): void {
    this.selectedAreaIndividualLeaderId = event;
    this.selectedAreaIndividualLeaderIdEvent.emit(
      this.selectedAreaIndividualLeaderId
    );
    this.checkAndComplete();
  }

  checkAndComplete(): void {
    if (
      this.selectedAreaIndividualLeaderId &&
      this.selectedAreaIndividualLeaderId !== this.lockedSelectId
    ) {
      this.storeService.setData(
        StoreKeys.SELECTED_LEADER_ID_BY_AREA,
        this.selectedAreaIndividualLeaderId
      );
    }

    if (
      this.selectedAreaIndividualLeaderId &&
      this.selectedAreaIndividualsIds?.length > 0
    ) {
      this.storeService.setData(
        StoreKeys.SELECTED_INDIVIDUALS_IDS_BY_AREA,
        this.selectedAreaIndividualsIds
      );
    }

    if (this.step) {
      this.step.isComplete = true;
    }
  }

  openModalArea(): void {
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
            this.createArea(this.aggrupationData);
          } else if (aggrupationData.action === GroupingActions.VIEW) {
            this.storeService.clearValue(
              StoreKeys.SELECTED_INDIVIDUALS_IDS_BY_AREA
            );
            this.selectedAreaId = aggrupationData.id;
            this.prevSelectedValue = this.selectedAreaId;
            this.storeService.setData(
              StoreKeys.SELECTED_AREA_ID,
              this.selectedAreaId
            );
            this.selectedAreaChange.emit(this.selectedAreaId);
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
          this.selectedAreaId = this.prevSelectedValue;
          this.aggrupationData = null;
          this.loading = false;
        }
      });
  }

  openModalUpdate(): void {
    this.modalService.openPopUp(
      IndividualAggrupationComponent,
      this.getParams()
    );
    this.modalService.confirmedPopUp().subscribe((data: AggrupationData) => {
      if (data) {
        this.aggrupationData = data;
        if (data.action === GroupingActions.EDIT) {
          this.editArea(this.aggrupationData);
        } else if (data.action === GroupingActions.DUPLICATE) {
          this.createArea(this.aggrupationData);
        }
      } else {
        this.aggrupationData.action = GroupingActions.VIEW;
        this.openModalArea();
      }
    });
  }

  openModalConfirmation(): void {
    const dialogData: ConfirmDialogModel = {
      title: 'Eliminar el area',
      message: '¿Desea eliminar el area?',
    };
    this.modalService.openPopUp(ConfirmDialogComponent, {
      width: '600px',
      closeOnNavigation: true,
      data: dialogData,
    });
    this.modalService.confirmedPopUp().subscribe((data: any) => {
      if (data) {
        this.deleteArea();
      } else {
        this.aggrupationData.action = GroupingActions.VIEW;
        this.openModalArea();
      }
    });
  }

  ///AREA CREATION
  createArea(aggrupation: AggrupationData): void {
    const request: AreaAddRequest = {
      areaId: aggrupation.id,
      name: aggrupation.inputAggrupation,
      baseId: this.selectedClientId,
      subBaseId: this.selectedSubbaseId,
      individualIds: aggrupation.selectedIndividuals,
    };

    this.areaSub = this.areaService.addArea(request).subscribe({
      next: data => {
        this.selectedAreaId = aggrupation.id;
        this.getAreas();
        this.loading = false;
        this.aggrupationData = null;
      },
      error: err => {
        console.log('error: ', err);
      },
    });
  }

  //AREA EDITION
  editArea(aggrupation: AggrupationData): void {
    let request: AreaRequest = {
      areaId: aggrupation.id,
      name: aggrupation.inputAggrupation,
      baseId: this.selectedClientId,
      subBaseId: this.selectedSubbaseId,
    };
    this.areaSub = this.areaService
      .updateArea(aggrupation.id, request)
      .subscribe({
        next: data => {
          this.updateRelationshipAreaAndIndividuals(
            aggrupation.id,
            aggrupation.selectedIndividuals
          );
        },
        error: err => {
          console.log('error al editar area: ', err);
        },
      });
  }

  updateRelationshipAreaAndIndividuals(
    areaId: string,
    selectedIndividuals: string[]
  ): void {
    let obs: Array<Observable<any>> = this.loadObsRequest(
      areaId,
      selectedIndividuals
    );

    if (obs.length > 0) {
      this.updateRelationAreaIndividualsSub = combineLatest(...obs)
        .pipe()
        .subscribe({
          next: (response: (any | any)[]) => {
            if (
              response.some(value =>
                [
                  'ERROR_ADD_AREA_INDIVIDUAL',
                  'ERROR_DELETE_AREA_INDIVIDUAL',
                ].includes(value)
              )
            ) {
              this.loadErrors(response);
            } else {
              this.getAreas();
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
    areaId: string,
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
      obs.push(this.addAreaIndividual(areaId, newIndividuals));
    }
    if (oldIndividuals.length > 0) {
      let deleteAreaIndividualList = this.preselectedIds.filter(data =>
        oldIndividuals.includes(data.individualId)
      );
      obs.push(
        this.deleteAreaIndividual(
          areaId,
          deleteAreaIndividualList.map(data => data.individualId)
        )
      );
    }

    return obs;
  }

  loadErrors(response: string[]): void {
    let resultError: string[] = [];

    for (let i = 0; i < response.length; i++) {
      if (
        response[i] === 'ERROR_ADD_AREA_INDIVIDUAL' ||
        response[i] === 'ERROR_DELETE_AREA_INDIVIDUAL'
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

  addAreaIndividual(areaId: string, individuals: string[]): Observable<string> {
    return this.addAreaIndividualLoader
      .load(this.areaService.addAreaIndividual(areaId, individuals))
      .pipe(
        catchError(error => {
          console.log('error: ', error);
          return of('ERROR_ADD_AREA_INDIVIDUAL');
        })
      );
  }

  deleteAreaIndividual(areaId: string, individuals: string[]): any {
    return this.deleteAreaIndividualLoader
      .load(this.areaService.deleteAreaIndividual(areaId, individuals))
      .pipe(
        catchError(error => {
          console.log('error: ', error);
          return of('ERROR_DELETE_AREA_INDIVIDUAL');
        })
      );
  }

  //AREA EDITION

  //AREA DELETE
  deleteArea(): void {
    this.areaSub = this.areaService
      .deleteArea(this.aggrupationData.id)
      .subscribe({
        next: data => {
          this.selectedAreaId = null;
          this.aggrupationData = null;
          this.getAreas();
          this.loading = false;
        },
        error: err => {
          console.log('error: ', err);
        },
      });
  }
  //AREA DELETE
}
