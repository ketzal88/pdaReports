import { Component, Input, OnInit } from '@angular/core';
import { ResumeTips } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';

@Component({
  selector: 'app-explore-your-cvwith-these-tips',
  templateUrl: './explore-your-cvwith-these-tips.component.html',
  styleUrls: ['./explore-your-cvwith-these-tips.component.scss'],
})
export class ExploreYourCVWithTheseTipsComponent implements OnInit {
  @Input() resumeTips: ResumeTips;

  constructor() {}

  ngOnInit(): void {}
}
