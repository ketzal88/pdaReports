import {
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
import { GeneratedReportByIdResponse } from '../../../../core/services/microservices/reports/interfaces/generatedReportsResponse.interface';
import { StoreKeys } from '../../../../core/consts/store-keys.enum';
import { StoreService } from '../../../../core/services/store.service';
import { GetCompetencyResponse } from '../../../../core/services/microservices/competency/competency.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select-competencies',
  templateUrl: './select-competencies.component.html',
  styleUrls: ['./select-competencies.component.scss'],
})
export class SelectCompetenciesComponent implements OnInit, OnDestroy {
  //Bindings
  selectedCompetencies: Competency[];

  availableCompetencies: Competency[];
  availableCompetenciesCategories: CompetencyCategory[];

  panelOpenState = false;

  maxSelectableCompetencies: number = 20;

  //Inputs
  @Input() step!: StepModel;
  @Input() selectedClientId: string;
  @Input() selectedSubbaseId: string;
  @Input() generatedReportByIdResponse: GeneratedReportByIdResponse;

  //Outputs
  @Output() selectedItem = new EventEmitter<string[]>();

  //Subscriptors
  competencyCategorySub: Subscription;
  competenciesSub: Subscription;
  competenciesByIdsSub: Subscription;

  constructor(
    private competencyService: CompetencyService,
    private displayMessageService: DisplayMessageService,
    private storeService: StoreService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.availableCompetencies = [];
    this.availableCompetenciesCategories = [];
    this.selectedCompetencies = [];
    let selectedCompetencies: Competency[] = this.storeService.getData(
      StoreKeys.SELECTED_COMPETENCIES
    );
    if (selectedCompetencies && selectedCompetencies.length > 0) {
      this.selectedCompetencies = selectedCompetencies;
    } else {
      if (
        this.generatedReportByIdResponse &&
        this.generatedReportByIdResponse.reportGeneratedCompetencies &&
        this.generatedReportByIdResponse.reportGeneratedCompetencies.length > 0
      ) {
        //Aca consulto servicio para obtener informacion de las competencias desde el reporte generado
        this.loadCompetenciesByGeneratedReport();
      }
    }

    this.checkAndComplete();
    this.getCompetencyCategories();
  }

  ngOnDestroy(): void {
    unsubscribe(this.competencyCategorySub);
    unsubscribe(this.competenciesSub);
    unsubscribe(this.competenciesByIdsSub);
  }

  loadCompetenciesByGeneratedReport(): void {
    this.competenciesByIdsSub = this.competencyService
      .getCompetencies(
        this.generatedReportByIdResponse.reportGeneratedCompetencies.map(
          data => data.competencyId
        ),
        null,
        null
      )
      .subscribe({
        next: (res: GetCompetencyResponse) => {
          this.selectedCompetencies = res.data;
          this.checkAndComplete();
        },
        error: err => {
          console.log(
            `${this.translateService.instant(
              'REPORT_CONFIGURATION.selectCompetencies.ERROR.RETRIEVING_COMPETENCIES'
            )}: `,
            err
          );
        },
      });
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
      .getCompetencies(null, null, competencyCategoryId)
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
    const exists = this.selectedCompetencies.some(x => x.id === competency.id);
    return exists;
  }

  selectCompetency(competency: Competency): void {
    const indexCompetency = this.selectedCompetencies.findIndex(data => {
      return data.id === competency.id;
    });

    if (indexCompetency > -1) {
      this.selectedCompetencies.splice(indexCompetency, 1);
    } else {
      this.selectedCompetencies.push(competency);
    }

    this.checkAndComplete();
  }

  checkAndComplete(): void {
    if (this.selectedCompetencies.length < this.maxSelectableCompetencies) {
      this.step.isComplete = true;
      this.storeService.setData(
        StoreKeys.SELECTED_COMPETENCIES,
        this.selectedCompetencies
      );
      this.selectedItem.emit(this.selectedCompetencies.map(data => data.id));
    } else {
      this.step.isComplete = false;
    }
  }

  //TEMPORAL
  Select10(): void {
    this.competenciesSub = this.competencyService
      .getCompetencies()
      .subscribe(r => {
        this.availableCompetencies = r.data;
        this.selectedCompetencies = r.data.slice(10);
        this.step.isComplete = true;
        this.selectedItem.emit(this.selectedCompetencies.map(data => data.id));
        this.competenciesSub.unsubscribe();
      });
  }

  openCompetenciesPopUp(): void {
    const message = new PopUpMessage('');
    message.imageUrl = '/assets/img/report-central/PopUp_Competencies.svg';
    this.displayMessageService.openPopUp(message);
  }
}
