import { Component, Input, OnInit } from '@angular/core';
import { KnowWhatYourKeyCompetenciesAre } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';

@Component({
  selector: 'app-know-your-key-competencies',
  templateUrl: './know-your-key-competencies.component.html',
  styleUrls: ['./know-your-key-competencies.component.scss'],
})
export class KnowYourKeyCompetenciesComponent implements OnInit {
  @Input() knowWhatYourKeyCompetenciesAre: KnowWhatYourKeyCompetenciesAre;

  constructor() {}

  ngOnInit(): void {}
}
