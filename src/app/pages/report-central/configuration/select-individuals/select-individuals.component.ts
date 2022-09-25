import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StepModel } from '../../../../core/models/step.model';
import { VwGetAllIndividualWithBehaviouralProfile } from 'src/app/core/services/microservices/individual/individual.interface';

import { StoreService } from '../../../../core/services/store.service';
import { StoreKeys } from '../../../../core/consts/store-keys.enum';
import { TypeFilter } from '../../../../shared/components/mat-custom-individuals-table/models/type-filter.interface';

@Component({
  selector: 'app-select-individuals',
  templateUrl: './select-individuals.component.html',
  styleUrls: ['./select-individuals.component.scss'],
})
export class SelectIndividualsComponent implements OnInit {
  //Bindings
  selectedIndividualIds: string[];

  //Inputs
  @Input() step!: StepModel;
  @Input() multipleSelection: boolean = false;
  @Input() lockedSelectId?: string;
  @Input() typeFilterList: TypeFilter[];
  @Input() selectedClientId: string;
  @Input() selectedSubbaseId?: string = undefined;

  //Outputs
  @Output() selectedItem = new EventEmitter<
    VwGetAllIndividualWithBehaviouralProfile[]
  >();

  constructor(private storeService: StoreService) {}
  ngOnInit(): void {
    this.loadIndividualIds();
    if (this.selectedIndividualIds?.length > 0) {
      this.step.isComplete = true;
    } else {
      this.step.isComplete = false;
    }
  }

  loadIndividualIds(): void {
    let selectedIndividualdsFound: VwGetAllIndividualWithBehaviouralProfile[] =
      this.storeService.getData(StoreKeys.SELECTED_INDIVIDUALS);

    this.selectedIndividualIds = selectedIndividualdsFound?.reduce(
      (
        acc: string[],
        currentValue: VwGetAllIndividualWithBehaviouralProfile
      ) => {
        acc.push(currentValue.individualId);
        return acc;
      },
      []
    );
  }

  onIndividualsSelection(
    event: VwGetAllIndividualWithBehaviouralProfile[]
  ): void {
    this.storeService.setData(StoreKeys.SELECTED_INDIVIDUALS, event);
    this.selectedItem.emit(event);
    if (event.length > 0) {
      this.step.isComplete = true;
    } else {
      this.step.isComplete = false;
    }
  }
}
