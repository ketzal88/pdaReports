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
    this.behavioralTrends.behavioralTrendsDetails = this.behavioralTrends.behavioralTrendsDetails.splice(0,5);
  }
  
  changeBehavioralTrend(idx: number): void {
    this.idxSelected = idx;
  }

  changeClose(idx: number): void {
    if (this.idxSelected == idx){
      this.idxSelected = undefined;
    }
  }
}
