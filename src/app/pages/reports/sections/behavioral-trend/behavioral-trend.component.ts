import { Component, Input, OnInit } from '@angular/core';
import { BehavioralTrend, BehavioralTrendsDetail, } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
@Component({
  selector: 'app-behavioral-trend',
  templateUrl: './behavioral-trend.component.html',
  styleUrls: ['./behavioral-trend.component.scss'],
})
export class BehavioralTrendComponent implements OnInit {

  @Input() behavioralTrends: BehavioralTrend;
  idxSelected: number;
  constructor() { }

  ngOnInit(): void { 
    console.warn(this.behavioralTrends)
  }
  
  changeBehavioralTrend(idx: number): void {
    this.idxSelected = idx;
  }

  changeClose(idx: number): void {
    this.idxSelected = undefined;
  }
}
