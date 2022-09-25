import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { CompetencyService } from 'src/app/core/services/microservices/competency/compentecy.service';
import {
  Competency,
  CompetencyCategory,
} from 'src/app/core/services/microservices/competency/competency.interface';
import { StepModel } from '../../../../core/models/step.model';
import { Subscription } from 'rxjs';
import { PopUpMessage } from 'src/app/shared/components/display-message/displayMessage.interface';
import { DisplayMessageService } from '../../../../core/services/displayMessage.service';
import { unsubscribe } from '../../../../core/utils/subscription.util';

@Component({
  selector: 'app-select-competencies',
  templateUrl: './select-competencies.component.html',
  styleUrls: ['./select-competencies.component.scss'],
})
export class SelectCompetenciesComponent implements OnInit, OnDestroy {
  //Bindings
  competenciesSelected: Competency[];

  availableCompetencies: Competency[];
  availableCompetenciesCategories: CompetencyCategory[];

  panelOpenState = false;

  neededQuantityCompetencies: number = 10;

  //Inputs
  @Input() step!: StepModel;
  @Input() selectedClientId: string;
  @Input() selectedSubbaseId: string;

  //Outputs
  @Output() selectedItem = new EventEmitter<Competency[]>();

  //Subscriptors
  competencyCategorySub: Subscription;
  competenciesSub: Subscription;

  constructor(
    private competencyService: CompetencyService,
    private displayMessageService: DisplayMessageService
  ) {}

  ngOnInit(): void {
    this.availableCompetencies = [];
    this.competenciesSelected = [];
    this.getCompetencyCategories();
  }

  ngOnDestroy(): void {
    unsubscribe(this.competencyCategorySub);
    unsubscribe(this.competenciesSub);
  }

  //Api Data
  getCompetencyCategories(name?: string): void {
    this.competencyCategorySub = this.competencyService
      .getCompetencyCategories(name)
      .subscribe(r => {
        this.availableCompetenciesCategories = r;
        this.competencyCategorySub.unsubscribe();
      });
  }

  getCompetencies(competencyCategoryId: string): void {
    this.competenciesSub = this.competencyService
      .getCompetencies(null, competencyCategoryId)
      .subscribe(r => {
        this.availableCompetencies = r.data;
        this.competenciesSub.unsubscribe();
      });
  }
  //Api data

  onChangeCompetencyCategory(
    competencyCategoryValue: CompetencyCategory
  ): void {
    this.getCompetencies(competencyCategoryValue.competencyCategoryId);
  }

  isChecked(competency: Competency): boolean {
    const exists = this.competenciesSelected.some(x => x.id === competency.id);
    return exists;
  }

  selectCompetency(competency: Competency): void {
    const indexCompetency = this.competenciesSelected.findIndex(data => {
      return data.id === competency.id;
    });

    if (indexCompetency > -1) {
      this.competenciesSelected.splice(indexCompetency, 1);
    } else {
      this.competenciesSelected.push(competency);
    }

    if (this.competenciesSelected.length === this.neededQuantityCompetencies) {
      this.step.isComplete = true;
      this.selectedItem.emit(this.competenciesSelected);
    } else {
      this.step.isComplete = false;
    }
  }

  //TEMPORAL
  Select10() {
    this.competenciesSub = this.competencyService
      .getCompetencies()
      .subscribe(r => {
        this.availableCompetencies = r.data;
        this.competenciesSelected = r.data.slice(10);
        this.step.isComplete = true;
        this.selectedItem.emit(this.competenciesSelected);
        this.competenciesSub.unsubscribe();
      });
  }

  openCompetenciesPopUp(): void {
    const message = new PopUpMessage('');
    message.imageUrl = '/assets/img/report-central/PopUp_Competencies.svg';
    this.displayMessageService.openPopUp(message);
  }
}
