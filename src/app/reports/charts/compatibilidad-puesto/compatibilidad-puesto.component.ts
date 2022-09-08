import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { colorPrimary, colorPrimaryDarker, colorSecondary } from '../../themes/blue';

@Component({
  selector: 'chart-compatibilidad-puesto',
  templateUrl: './compatibilidad-puesto.component.html',
  styleUrls: ['./compatibilidad-puesto.component.scss']
})
export class CompatibilidadPuestoComponent implements OnInit {

  @ViewChild('chartContainer') container!: ElementRef;
  constructor() { }

  chart!: anychart.charts.Pie;

  ngOnInit(): void {
    let data = anychart.data.set([
      {
        value: 73,
        stroke: {
          angle: 45,
          lineJoin: "round",
          lineCap: "round",
          mode: true,
          opacity: 1,
          thickness: 40,
          keys: [{ color: colorPrimary, offset:0, opacity: 1 }, { color:"#40c4ff", offset: 0.8, opacity: 1 }],
        },
        normal: {
          zIndex: 4,
        },
        zIndex: 5,
      },
      { value: 2.5, stroke: { thickness: 0 } },
      {
        value: 27,
        stroke: {
          color: "#F4F4F4",
          thickness: 40,
          lineJoin: "round",
          lineCap: "round",
        },
        normal: {
          zIndex: -8
        },
      },
      { value: 2.5, stroke: { thickness: 0 } },
    ]);

    // create pie chart with passed data
    let chart = anychart.pie(data);

    this.chart = chart;

    // set chart radius
    chart
      .innerRadius('100%')
      .legend(false)
      .interactivity(false);

    chart.background("#ff000000");

    // create standalone label and set settings
    let porc = anychart.standalones.label();
    porc
      .enabled(true)
      .text('72%')
      .width('100%')
      .height('100%')
      .adjustFontSize(true, true)
      .minFontSize(10)
      .maxFontSize(80)
      .fontColor('black')
      .fontWeight(600)
      .position('center')
      .anchor('center')
      .hAlign('center')
      .vAlign('bottom');

    let label = anychart.standalones.label();
    label
      .enabled(true)
      .text('Compatibilidad \nde Puesto')
      .width('100%')
      .height('100%')
      .adjustFontSize(true, true)
      .minFontSize(10)
      .maxFontSize(50)
      .fontColor('black')
      .fontWeight(600)
      .position('center')
      .anchor('center')
      .hAlign('center')
      .vAlign('top');

    let tab = anychart.standalones.table(2, 1);
    tab.border("black", 0);
    tab.cellBorder("black", 0);
    tab.getCell(0, 0).content(porc);
    tab.getCell(1, 0).content(label);

    // set label to center content of chart
    chart.center().content(tab);
  }

  ngAfterViewInit() {
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
  }

}
