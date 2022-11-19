import { Component, Input, OnInit } from '@angular/core';
import { DoYouKnowWhataBehavioralProfileIs } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';

@Component({
  selector: 'app-question-behavioral-profile',
  templateUrl: './question-behavioral-profile.component.html',
  styles: [],
})
export class QuestionBehavioralProfileComponent implements OnInit {
  @Input() doYouKnowWhataBehavioralProfileIs: DoYouKnowWhataBehavioralProfileIs;

  constructor() {}

  ngOnInit(): void {}
}
