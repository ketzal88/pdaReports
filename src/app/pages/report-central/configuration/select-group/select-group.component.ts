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
import { VwGetAllIndividualWithBehaviouralProfile } from '../../../../core/services/microservices/individual/individual.interface';
import { ModalService } from '../../../../core/services/modal.service';
import { IndividualAggrupationComponent } from '../../../../shared/components/individuals/modal/individual-aggrupation/individual-aggrupation.component';
import { GroupingActions } from '../../../../core/consts/grouping-actions.enum';
import { AggrupationData } from '../../../../shared/components/individuals/interfaces/aggrupation-data.interface';
import { GroupingService } from '../../../../core/services/microservices/individual/grouping.service';
import { Subscription } from 'rxjs';
import { unsubscribe } from '../../../../core/utils/subscription.util';
import {
  GroupAddRequest,
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

  //Inputs
  @Input() step!: StepModel;
  @Input() selectedClientId: string;
  @Input() selectedSubbaseId: string;
  @Input() typeFilterList: TypeFilter[];

  //Outputs
  @Output() selectedIndividualsOfGroupChange = new EventEmitter<string[]>();
  @Output() selectedGroupChange = new EventEmitter<string>();
  //Variables
  groups: GroupingResponse[];
  prevSelectedValue: string;
  isFirstEventModal: boolean = false;

  aggrupationData: AggrupationData;

  //Subscriptions
  groupingSub: Subscription;

  //Viewchilds
  @ViewChild('groupSelect') groupSelect: MatSelect;

  constructor(
    private modalService: ModalService,
    private storeService: StoreService,
    private groupingService: GroupingService
  ) {}

  ngOnInit(): void {
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

  loadIndividualIds(): void {
    let selectedIndividualdsFound: VwGetAllIndividualWithBehaviouralProfile[] =
      this.storeService.getData(StoreKeys.SELECTED_INDIVIDUALS_BY_GROUP);

    this.selectedIndividualIds = selectedIndividualdsFound?.map(
      ind => ind.individualId
    );
  }

  getGroups(): void {
    this.groupingSub = this.groupingService
      .getGroupings(this.getRequestGroup())
      .subscribe({
        next: (data: GroupingResponse[]) => {
          this.groups = [...data];
          this.groups.unshift({
            groupingId: 'NEW',
            name: 'Nuevo grupo',
            baseId: null,
            subBaseId: null,
            creationDate: null,
            deletionDate: null,
          });

          this.initSelectGroup();
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

  loadLockedSelect(): void {
    let selectedIndividuals: VwGetAllIndividualWithBehaviouralProfile[] = [];
    selectedIndividuals = this.storeService.getData(
      StoreKeys.SELECTED_INDIVIDUALS
    );
    this.lockedSelectId = selectedIndividuals[0].individualId;
  }

  onIndividualsSelection(
    event: VwGetAllIndividualWithBehaviouralProfile[]
  ): void {
    this.storeService.setData(StoreKeys.SELECTED_INDIVIDUALS_BY_GROUP, event);
    this.selectedIndividualIds = event.map(ind => ind.individualId);

    this.selectedIndividualsOfGroupChange.emit(this.selectedIndividualIds);
    if (event.length > 0) {
      this.completeStep();
    } else {
      this.incompleteStep();
    }
  }

  onGroupChange(opened: boolean): void {
    if (!opened && this.selectedGroup && this.groupSelect.focused) {
      this.openModalGroup();
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
          this.getGroups();
          this.loading = false;
          this.aggrupationData = null;
        },
        error: err => {
          console.log('error al editar grupo: ', err);
        },
      });
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
  deleteIndividualsOfGroup(): void {
    this.groupingSub = this.groupingService
      .deleteGroupingIndividual(
        this.aggrupationData.id,
        this.aggrupationData.selectedIndividuals[0]
      )
      .subscribe({
        next: data => {},
        error: err => {},
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
