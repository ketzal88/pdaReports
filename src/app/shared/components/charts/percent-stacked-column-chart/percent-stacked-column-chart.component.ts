import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import 'anychart';

import { disabledCredits } from '../../../utils/chart.util';
@Component({
  selector: 'app-percent-stacked-column-chart',
  templateUrl: './percent-stacked-column-chart.component.html',
  styleUrls: ['./percent-stacked-column-chart.component.scss']
})
export class PercentStackedColumnChartComponent implements OnInit { chart!: any;
  names!: any;
  series!: any;

  @ViewChild('chartContainer') container: any; //Esto viene del div

  constructor() { }

  ngOnInit(): void {
   let dataSet = anychart.data.set([
      ['18 a 30', 20, 40, 40],
      ['31 a 45', 15, 25, 60],
      ['46 a 59', 10, 40, 50],
      ['+60', 50, 50, 0],
     

      
  ]);

  // map data for the first series, take x from the zero column and value from the first column of data set
 let seriesData_1 = dataSet.mapAs({'x': 0, 'value': 1});

  // map data for the second series, take x from the zero column and value from the second column of data set
  let seriesData_2 = dataSet.mapAs({'x': 0, 'value': 2});

  // map data for the second series, take x from the zero column and value from the third column of data set
  let seriesData_3 = dataSet.mapAs({'x': 0, 'value': 3});

  // map data for the fourth series, take x from the zero column and value from the fourth column of data set
 // let seriesData_4 = dataSet.mapAs({'x': 0, 'value': 4});

  // create bar chart
  this.chart = anychart.column();

  // turn on chart animation
  this.chart.animation(true);

  // force chart to stack values by Y scale.
  this.chart.yScale().stackMode('percent');

  // set yAxis labels formatting, force it to add % to values
  this.chart.yAxis(0).labels().format("{%Value}%");
  this.chart.xAxis(0, {ticks: false, labels: true, stroke: '#ffffff'});
  this.chart.yAxis(0, {ticks: false, labels: false, stroke: '#ffffff'});

  // helper function to setup label settings for all series
  var setupSeries = function (series: any, name: any) {
      series.stroke('2 #fff 1');
      series.name(name);
      series.hovered().stroke('2 #fff 1');
      series.tooltip().titleFormat("{%Name}");
  };

  // temp variable to store series instance
  var series;

  // create first series with mapped data
  series = this.chart.column(seriesData_1);
  series.fill("#5DE4E4");
  setupSeries(series, 'No binario');
 

  // create second series with mapped data
  series = this.chart.column(seriesData_2);
  series.fill("#E6A0F2");
  setupSeries(series, 'Femenino');

  // create third series with mapped data
  series = this.chart.column(seriesData_3);
  series.fill("#FFA902");
  setupSeries(series, 'Masculino');


  this.chart.interactivity().hoverMode('by-x');
  this.chart.tooltip().displayMode('union');

  this.chart.pointWidth(25);


  }
  ngAfterViewInit(): void {
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
    disabledCredits(this.chart);
  }

}
