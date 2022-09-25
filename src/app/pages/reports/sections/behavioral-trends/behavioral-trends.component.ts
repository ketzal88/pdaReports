import { Component, Input, OnInit } from '@angular/core';
import {
  BehavioralTrend,
  BehavioralTrendsDetail,
} from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';

@Component({
  selector: 'app-behavioral-trends',
  templateUrl: './behavioral-trends.component.html',
  styleUrls: ['./behavioral-trends.component.scss'],
})
export class BehavioralTrendsComponent implements OnInit {
  //Inputs
  @Input() behavioralTrends: BehavioralTrend;
  //Bindings
  panelOpenState = false;
  behavioralTrendsDetailSelected?: BehavioralTrendsDetail;
  idxSelected: number;
  listViewTrends: number[];

  constructor() {}

  ngOnInit(): void {
    this.behavioralTrendsDetailSelected = null;
    this.listViewTrends = [];
  }

  changeBehavioralTrend(item: BehavioralTrendsDetail, idx: number): void {
    this.idxSelected = idx;
    if (this.listViewTrends.length > 0) {
      if (!this.listViewTrends.includes(idx)) {
        this.listViewTrends.push(idx);
      }
    } else {
      this.listViewTrends.push(idx);
    }
  }

  changeClose(idx: number): void {
    this.idxSelected = undefined;
    this.listViewTrends = this.listViewTrends.filter(item => item !== idx);
  }
}
