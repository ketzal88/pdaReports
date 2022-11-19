import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreService } from '../../../../../core/services/store.service';
import { VwGetAllIndividualWithBehaviouralProfile } from '../../../../../core/services/microservices/individual/individual.interface';
import { Subscription, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { GroupingActions } from '../../../../../core/consts/grouping-actions.enum';
import { GuidService } from '../../../../../core/services/guid.service';
import { AggrupationOptions } from '../../interfaces/aggrupation-options.interface';
import { AggrupationData } from '../../interfaces/aggrupation-data.interface';
import { StoreKeys } from '../../../../../core/consts/store-keys.enum';
import { TypeFilter } from '../../../mat-custom-individuals-table/models/type-filter.interface';

@Component({
  selector: 'app-individual-aggrupation',
  templateUrl: './individual-aggrupation.component.html',
  styleUrls: ['./individual-aggrupation.component.scss'],
})
export class IndividualAggrupationComponent implements OnInit, OnDestroy {
  //Bindings
  lockedSelectId?: string;
  inputGrouping: string;
  pageSize = 5;
  title: string;
  subtitle: string;
  btn: string;
  placeholder: string;
  selectedClientId: string;
  selectedSubbaseId: string;
  selectedGroupingId: string;
  selectedAreaId: string;
  hasSelect: boolean;
  typeFilterList: TypeFilter[];

  //Variables
  private type: string;
  private selectedIndividuals: string[];
  private aggrupationData: AggrupationData;
  preselectedIds: string[];

  //Subscriptions
  labelSub: Subscription;

  constructor(
    private storeService: StoreService,
    private translateService: TranslateService,
    private guidService: GuidService,
    public dialogRef: MatDialogRef<IndividualAggrupationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AggrupationOptions
  ) {
    this.typeFilterList = this.data.typeFilterList;
    this.initFilter();
    this.selectedClientId = this.data.selectedClientId;
    this.selectedSubbaseId = this.data.selectedSubbaseId;
  }
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.preselectedIds = this.data.preselectedIds;
    this.loadLockedSelect();
    this.initLabels();
    this.initSelect();
  }

  initFilter(): void {
    if (this.data.action === 'NEW') {
      this.selectedGroupingId = null;
      this.selectedAreaId = null;
    } else {
      if (this.data.type === 'GROUP') {
        this.selectedGroupingId = this.data.aggrupation.id;
      } else if (this.data.type === 'AREA') {
        this.selectedAreaId = this.data.aggrupation.id;
      }
    }
  }

  initLabels(): void {
    this.setInputGrouping();
    this.getLabelType();
    if (
      this.data.action === GroupingActions.NEW ||
      this.data.action === GroupingActions.EDIT ||
      this.data.action === GroupingActions.DUPLICATE
    ) {
      this.getLabelTitle();
    } else {
      this.title = this.data.aggrupation.name;
    }
    this.getLabelSubtitle();
    this.getLabelPlaceholder();
    this.getLabelBtn();
  }

  initSelect(): void {
    this.hasSelect = this.data.action === GroupingActions.VIEW ? false : true;
  }

  setInputGrouping(): void {
    if (
      this.data.action === GroupingActions.EDIT ||
      this.data.action === GroupingActions.DUPLICATE
    ) {
      this.inputGrouping = this.data.aggrupation.name;
    }
  }

  getLabelType(): void {
    this.translateService
      .get(`GROUPING_COMPONENT.${this.data.type}.TYPE`)
      .pipe(take(1))
      .subscribe((res: string) => {
        this.type = res;
      });
  }

  getLabelTitle(): void {
    this.translateService
      .get(
        `GROUPING_COMPONENT.${
          this.data.action === GroupingActions.NEW
            ? this.data.type + '.' + this.data.action
            : this.data.action
        }`
      )
      .pipe(take(1))
      .subscribe((res: string) => {
        this.title = res;
      });
  }

  getLabelSubtitle(): void {
    this.translateService
      .get(`GROUPING_COMPONENT.${this.data.type}.SUBTITLE`)
      .pipe(take(1))
      .subscribe((res: string) => {
        this.subtitle = res;
      });
  }

  getLabelPlaceholder(): void {
    this.translateService
      .get(`GROUPING_COMPONENT.${this.data.type}.INPUT_PLACEHOLDER`)
      .pipe(take(1))
      .subscribe((res: string) => {
        this.placeholder = res;
      });
  }

  getLabelBtn(): void {
    this.translateService
      .get(this.getLabelTranslate(), {
        TYPE: this.data.action === GroupingActions.NEW ? this.type : null,
      })
      .pipe(take(1))
      .subscribe((res: string) => {
        this.btn = res;
      });
  }

  getLabelTranslate(): string {
    let labelTranslate: string = '';
    switch (this.data.action) {
      case GroupingActions.NEW: {
        labelTranslate = 'GROUPING_COMPONENT.BTN_CREATE';
        break;
      }
      case GroupingActions.VIEW: {
        labelTranslate = 'GROUPING_COMPONENT.BTN';
        break;
      }
      default: {
        labelTranslate = 'GROUPING_COMPONENT.BTN_SAVE';
        break;
      }
    }

    return labelTranslate;
  }

  loadLockedSelect(): void {
    let selectedIndividuals: string[] = [];
    selectedIndividuals = this.storeService.getData(
      StoreKeys.SELECTED_INDIVIDUALS
    );

    if (selectedIndividuals) {
      this.lockedSelectId = selectedIndividuals[0];
    }
  }

  triggerEvent(): void {
    this.aggrupationData = {
      action: this.data.action,
      inputAggrupation: this.inputGrouping,
      selectedIndividuals: this.getIndividualIds(),
      id:
        this.data.action === GroupingActions.EDIT ||
        this.data.action === GroupingActions.VIEW
          ? this.data.aggrupation.id
          : this.guidService.generate(),
    };
    this.dialogRef.close(this.aggrupationData);
  }

  closePopUp(): void {
    this.cancel();
  }

  cancel(): void {
    this.close(false);
  }
  close(value: any): void {
    this.dialogRef.close(value);
  }
  confirm(): void {
    this.close(true);
  }

  onSelectedIndividuals(selectedIndividuals: string[]): void {
    this.selectedIndividuals = selectedIndividuals;
  }

  getIndividualIds(): string[] {
    return this.selectedIndividuals;
  }

  changeEdit(): void {
    this.aggrupationData = {
      action: GroupingActions.EDIT,
      inputAggrupation: this.inputGrouping,
      selectedIndividuals: this.getIndividualIds(),
      id: this.data.aggrupation.id,
    };
    this.dialogRef.close(this.aggrupationData);
  }

  changeDuplicate(): void {
    this.aggrupationData = {
      action: GroupingActions.DUPLICATE,
      inputAggrupation: this.inputGrouping,
      selectedIndividuals: this.getIndividualIds(),
      id: this.guidService.generate(),
    };
    this.dialogRef.close(this.aggrupationData);
  }

  changeDelete(): void {
    this.aggrupationData = {
      action: GroupingActions.DELETE,
      inputAggrupation: this.inputGrouping,
      selectedIndividuals: this.getIndividualIds(),
      id: this.data.aggrupation.id,
    };
    this.dialogRef.close(this.aggrupationData);
  }
}
