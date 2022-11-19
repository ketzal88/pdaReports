import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { disabledCredits } from '../../../utils/chart.util';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnInit, AfterViewInit {
  //Bindings
  chart!: anychart.charts.Pie;

  //Inputs
  @Input() data: any;

  //ViewChilds
  @ViewChild('chartContainer') container: any;

  constructor() {}

  ngOnInit(): void {
    this.chart = anychart.pie(this.data);
    disabledCredits(this.chart);
  }

  ngAfterViewInit(): void {
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
  }
}
