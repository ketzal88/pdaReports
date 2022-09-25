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
import { VwGetAllIndividualWithBehaviouralProfile } from 'src/app/core/services/microservices/individual/individual.interface';
import { ModalService } from 'src/app/core/services/modal.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from 'src/app/shared/components/individuals/modal/confirm-dialog/confirm-dialog.component';
import { IndividualAggrupationComponent } from 'src/app/shared/components/individuals/modal/individual-aggrupation/individual-aggrupation.component';
import { StoreService } from '../../../../core/services/store.service';
import { AreaService } from '../../../../core/services/microservices/individual/area.service';
import { Subscription } from 'rxjs';
import {
  AreaAddRequest,
  AreaRequest,
  AreaResponse,
} from '../../../../core/services/microservices/individual/area.interface';
import { AggrupationData } from 'src/app/shared/components/individuals/interfaces/aggrupation-data.interface';
import { MatSelect } from '@angular/material/select';
import { StoreKeys } from '../../../../core/consts/store-keys.enum';
import { TypeFilter } from '../../../../shared/components/mat-custom-individuals-table/models/type-filter.interface';
import { unsubscribe } from '../../../../core/utils/subscription.util';

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
  @Input() maxMultipleSelection: number = 3;

  @Input() lockedSelectId?: string;
  @Input() selectedClientId: string;
  @Input() selectedSubbaseId: string;

  @Input() selectedAreaId?: string;
  @Input() typeFilterList: TypeFilter[];

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

  aggrupationData: AggrupationData;

  //Viewchilds
  @ViewChild('areaSelect') areaSelect: MatSelect;

  //Subscriptions
  areaSub: Subscription;

  constructor(
    private storeService: StoreService,
    private modalService: ModalService,
    private areaService: AreaService
  ) {}

  ngOnInit(): void {
    this.loadIndividualIds();
    this.getAreas();
    this.loadLockedSelect();
  }
  ngOnDestroy(): void {
    unsubscribe(this.areaSub);
    this.storeService.clearValue(StoreKeys.PRESELECTED_IDS);
  }

  loadIndividualIds(): void {
    const selectedIndividualsIdsFound: string[] = this.storeService.getData(
      'selectedIndividualsIdsByArea'
    );
    const selectedIndividualLeaderIdFound: string = this.storeService.getData(
      'selectedAreaIndividualLeaderIdByArea'
    );

    this.selectedAreaIndividualsIds = selectedIndividualsIdsFound;
    this.selectedAreaIndividualLeaderId = selectedIndividualLeaderIdFound;
  }

  loadLockedSelect(): void {
    const selectedIndividualds: VwGetAllIndividualWithBehaviouralProfile[] =
      this.storeService.getData(StoreKeys.SELECTED_INDIVIDUALS);
    if (selectedIndividualds) {
      this.lockedSelectId = selectedIndividualds[0].individualId;
    }
  }

  onAreaChange(opened: boolean): void {
    if (!opened && this.selectedAreaId && this.areaSelect.focused) {
      this.openModalArea();
    }
  }

  initSelectArea(): void {
    this.selectedAreaId = this.selectedAreaId
      ? this.selectedAreaId
      : this.areas[1].areaId;
    this.prevSelectedValue = this.selectedAreaId;
    this.selectedAreaChange.emit(this.selectedAreaId);
  }

  getAreas(): void {
    this.areaSub = this.areaService.getAreas(this.getAreaRequest()).subscribe({
      next: (data: AreaResponse[]) => {
        this.areas = [...data];
        this.areas.unshift({
          areaId: 'NEW',
          name: 'Nueva Area',
          baseId: null,
          subBaseId: null,
          creationDate: null,
          deletionDate: null,
        });

        this.initSelectArea();
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

  onSelectedIndividuals(
    event: VwGetAllIndividualWithBehaviouralProfile[]
  ): void {
    if (event) {
      this.selectedAreaIndividualsIds = event.map(ind => ind.individualId);
      this.selectedAreaIndividualsIdsEvent.emit(
        this.selectedAreaIndividualsIds
      );
    }
    this.checkAndComplete();
  }

  onSelectedLeader(event: string | null): void {
    this.selectedAreaIndividualLeaderId = event;
    this.selectedAreaIndividualLeaderIdEvent.emit(
      this.selectedAreaIndividualLeaderId
    );
    this.checkAndComplete();
  }

  checkAndComplete(): void {
    if (
      (this.selectedAreaIndividualLeaderId &&
        this.selectedAreaIndividualLeaderId !== this.lockedSelectId) ||
      (this.selectedAreaIndividualLeaderId &&
        this.selectedAreaIndividualsIds?.length > 0)
    ) {
      this.storeService.setData(
        'selectedIndividualsIdsByArea',
        this.selectedAreaIndividualsIds
      );
      this.storeService.setData(
        'selectedAreaIndividualLeaderIdByArea',
        this.selectedAreaIndividualLeaderId
      );

      this.step.isComplete = true;
    } else {
      this.step.isComplete = false;
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
            this.storeService.clearValue('selectedIndividualsIdsByArea');
            this.storeService.clearValue(
              'selectedAreaIndividualLeaderIdByArea'
            );
            this.selectedAreaId = aggrupationData.id;
            this.prevSelectedValue = this.selectedAreaId;
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
          this.getAreas();
          this.loading = false;
          this.aggrupationData = null;
        },
        error: err => {
          console.log('error al editar area: ', err);
        },
      });
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
