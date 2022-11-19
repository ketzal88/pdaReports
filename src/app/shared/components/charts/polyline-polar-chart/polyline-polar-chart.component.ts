import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { disabledCredits } from '../../../utils/chart.util';

@Component({
  selector: 'app-polyline-polar-chart',
  templateUrl: './polyline-polar-chart.component.html',
  styleUrls: ['./polyline-polar-chart.component.scss'],
})
export class PolylinePolarChartComponent implements OnInit, AfterViewInit {
  chart!: any;

  @ViewChild('chartContainer') container: any; //Esto viene del div

  constructor() {}

  ngOnInit(): void {
    this.chart = anychart.polar();

    let data = anychart.data.mapAsTable([
      ['Determinación', 12814, 3054],
      ['Dinamismo', 13012, 5067],
      ['Expeditividad', 11624, 7004],
      ['Iniciativa', 8814, 9054],
      ['Persuación', 12998, 12043],
      ['Influencia', 12321, 15067],
      ['Autonomía', 10342, 10119],
      ['Asesoramiento', 22998, 12043],
      ['Servicios y Soporte', 11261, 10419],
      ['Amabilidad', 10261, 14419],
      ['Paciencia', 20261, 4419],
      ['Precisión', 18261, 34419],
      ['Concentración', 15241, 11419],
      ['Análisis', 21261, 11419],
      ['Obediencia', 14261, 9419],
      ['Implementación', 19261, 22419],
    ]);

    // set series type
    this.chart
      .defaultSeriesType('polygon')
      // disable y-axis
      .yAxis(false)
      // set x-scale
      .xScale('ordinal');
    // set chart x-axis settings
    this.chart.xAxis().fill('#EBEFF4').stroke('none').overlapMode('auto-width');
    this.chart.xAxis().labels().padding(10).fontSize(11).hAlign('center');
    let polygon = this.chart.polygon(data);

    // add series to chart
    this.chart.addSeries.apply(this.chart, data);
  }
  ngAfterViewInit(): void {
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
    disabledCredits(this.chart);
  }
}
