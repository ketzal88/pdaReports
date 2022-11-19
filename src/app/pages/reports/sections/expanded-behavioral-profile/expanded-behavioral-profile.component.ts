import { Component, Input, OnInit } from '@angular/core';
import { PDAChart } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';

@Component({
  selector: 'app-expanded-behavioral-profile',
  templateUrl: './expanded-behavioral-profile.component.html',
  styleUrls: ['./expanded-behavioral-profile.component.scss'],
})
export class ExpandedBehavioralProfileComponent implements OnInit {
  @Input() pdaCharts: PDAChart[];

  //Bindings
  idxSelected: number;
  listProfileViews: number[];

  constructor() {}

  ngOnInit(): void {
    this.listProfileViews = [];
  }

  changeExpandedBehavioral(item: PDAChart, idx: number): void {
    this.idxSelected = idx;
    if (this.listProfileViews.length > 0) {
      if (!this.listProfileViews.includes(idx)) {
        this.listProfileViews.push(idx);
      }
    } else {
      this.listProfileViews.push(idx);
    }
  }

  changeClose(idx: number): void {
    this.idxSelected = undefined;
    this.listProfileViews = this.listProfileViews.filter(item => item !== idx);
  }
}
