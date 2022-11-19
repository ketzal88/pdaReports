import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StepModel } from '../../../../core/models/step.model';

import { StoreService } from '../../../../core/services/store.service';
import { StoreKeys } from '../../../../core/consts/store-keys.enum';
import { TypeFilter } from '../../../../shared/components/mat-custom-individuals-table/models/type-filter.interface';
import { GeneratedReportByIdResponse } from '../../../../core/services/microservices/reports/interfaces/generatedReportsResponse.interface';

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
  @Input() generatedReportByIdResponse: GeneratedReportByIdResponse;

  //Outputs
  @Output() selectedItem = new EventEmitter<string[]>();

  constructor(private storeService: StoreService) {}
  ngOnInit(): void {
    this.loadIndividualIds();
  }

  loadIndividualIds(): void {
    let selectedIndividualdsFound: string[] = this.storeService.getData(
      StoreKeys.SELECTED_INDIVIDUALS
    );
    //Obtengo el individualId del reporte generado
    if (!selectedIndividualdsFound) {
      if (this.generatedReportByIdResponse) {
        if (this.generatedReportByIdResponse.individualId) {
          selectedIndividualdsFound = [
            this.generatedReportByIdResponse.individualId,
          ];
        } else {
          selectedIndividualdsFound = [];
        }
        this.selectedIndividualIds = selectedIndividualdsFound;
        this.loadAndSaveIndividual();
      }
    } else {
      this.selectedIndividualIds = selectedIndividualdsFound;
      this.loadAndSaveIndividual();
    }
  }

  onIndividualsSelection(selectedIndividualIds: string[]): void {
    this.selectedIndividualIds = selectedIndividualIds;
    this.loadAndSaveIndividual();
  }

  loadAndSaveIndividual(): void {
    this.storeService.setData(
      StoreKeys.SELECTED_INDIVIDUALS,
      this.selectedIndividualIds
    );
    this.selectedItem.emit(this.selectedIndividualIds);

    if (this.selectedIndividualIds.length > 0) {
      this.step.isComplete = true;
    } else {
      this.step.isComplete = false;
    }
  }
}
