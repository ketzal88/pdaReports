import { Component, Input, OnInit } from '@angular/core';
import { BehavioralProfileInfo } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';

@Component({
  selector: 'app-know-behavioral-profile',
  templateUrl: './know-behavioral-profile.component.html',
  styleUrls: ['./know-behavioral-profile.component.scss'],
})
export class KnowBehavioralProfileComponent implements OnInit {
  @Input() behavioralProfileInfo: BehavioralProfileInfo;

  constructor() {}

  ngOnInit(): void {}
}
