import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'chart-compatibilidad-grupo-candidatos',
  templateUrl: './compatibilidad-grupo-candidatos.component.html',
  styleUrls: ['./compatibilidad-grupo-candidatos.component.scss']
})
export class CompatibilidadGrupoCandidatosComponent implements OnInit {

  constructor() { }
  @ViewChild('chartContainer') container!: ElementRef;

  chart!: anychart.charts.Polar;

  ngOnInit() {
    this.chart = anychart.polar();
    let columnSeries = this.chart.column([
      { x: 'Rouge', value: 80540 },
      { x: 'Foundation', value: 94190 },
      { x: 'Mascara', value: 102610 },
      { x: 'Lip gloss', value: 110430 },
      { x: 'Lipstick', value: 128000 },
      { x: 'Nail polish', value: 143760 },
      { x: 'Eyebrow pencil', value: 170670 },
      { x: 'Eyeliner', value: 213210 },
      { x: 'Eyeshadows', value: 249980 }
    ]);
    // set series name
    columnSeries.name('Nevada');

    // set title settings
    this.chart
      .title()
      .enabled(true)
      .text('Cosmetic Products by Revenue')
      .padding({ bottom: 20 });

    // disable y-axis
    this.chart.yAxis(false);

    // set value prefix for tooltip
    this.chart.tooltip().valuePrefix('$');

    // set x-scale
    this.chart.xScale('ordinal');
    this.chart.innerRadius(50);
    this.chart.background().fill("red", 0);
  }

  ngAfterViewInit() {
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
  }
}
