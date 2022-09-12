import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { colorPrimary } from '../../themes/blue';

@Component({
  selector: 'chart-repna',
  templateUrl: './repna.component.html',
  styleUrls: ['./repna.component.scss']
})
export class RepnaComponent implements OnInit {

  constructor() { }

  @ViewChild('chartContainer') container!: ElementRef;

  chart!: anychart.charts.Graph;

  ngOnInit() {
    // create data
    let data = {
      "nodes": [
        { id: 'R', height: '30', x: 0, y: 168, fill: { src: "/assets/img/reports/R-color.svg", mode: "fit", }, },
        { id: 'E', height: '30', x: 40, y: 45, fill: { src: "/assets/img/reports/E-color.svg", mode: "fit", }, },
        { id: 'P', height: '30', x: 80, y: 75, fill: { src: "/assets/img/reports/P-color.svg", mode: "fit", }, },
        { id: 'N', height: '30', x: 120, y: 60, fill: { src: "/assets/img/reports/N-color.svg", mode: "fit", }, },
        { id: 'A', height: '30', x: 160, y: 30, fill: { src: "/assets/img/reports/A-color.svg", mode: "fit", }, },
      ],
      "edges": [
        { from: 'R', to: 'E' },
        { from: 'E', to: 'P' },
        { from: 'P', to: 'N' },
        { from: 'N', to: 'A' },
      ]
    }

    let chart = anychart.graph(data);
    chart.interactivity(false);

    chart.nodes().labels().enabled(false);
    chart.background().fill("black", 0);

    chart.layout().type('fixed');
    this.chart = chart;
  }

  ngAfterViewInit() {
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
  }
}
