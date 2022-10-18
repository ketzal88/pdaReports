import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {ThemeColors} from '../../../themes/blue';
import { MultipleJobCompatibility } from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';


@Component({
  selector: 'chart-compatibilidad-grupo-candidatos',
  templateUrl: './compatibilidad-grupo-candidatos.component.html',
  styleUrls: ['./compatibilidad-grupo-candidatos.component.scss']
})
export class CompatibilidadGrupoCandidatosComponent implements OnInit {

  constructor() { }
  @ViewChild('chartContainer') container!: ElementRef;

  @Input() data!: MultipleJobCompatibility[];
  chart!: anychart.charts.Polar;

  ngOnInit() {
    this.chart = anychart.polar();
    // let columnSeries = this.chart.column([
    //   { x: "IS", value: Math.random() },
    //   { x: "JS", value: Math.random() },
    //   { x: "JG", value: Math.random() },
    //   { x: "JC", value: Math.random() },
    //   { x: "SH", value: Math.random() },
    //   { x: "MA", value: Math.random() },
    //   { x: "JBL", value: Math.random() },
    //   { x: "FD", value: 0.5 },
    //   { x: "JPR", value: Math.random() },
    //   { x: "SC", value: Math.random() },
    //   { x: "MHM", value: Math.random() },
    //   { x: "HJ", value: Math.random() },
    //   { x: "PLG", value: Math.random() },
    //   { x: "DC", value: Math.random() },
    //   { x: "FGG", value: Math.random() },
    //   { x: "PA", value: Math.random() },
    //   { x: "DK", value: Math.random() },
    //   { x: "JU", value: Math.random() },
    //   { x: "LO", value: Math.random() },
    //   { x: "AC", value: 1 },
    // ]);
    const formattedData = this.data
    .filter(x => x.jobTitle !== 'Average' && x.jobTitle !== 'Promedio')
    .map(x => {
      return {
        x: x.jobTitle.split(":")[0].split(" ").map(x => x[0]).join(""),
        value: x.compatibilityPercentage * 100,
      };
    });
    let columnSeries = this.chart.column(formattedData).tooltip(false).selectionMode("none");
    columnSeries.color("#cccccc88").labels().format("{%value}%").enabled(false).fontColor("#ddddd").fontSize("100%");
    columnSeries.hovered().fill("#ff4b7e").hovered().labels().enabled(true);
    columnSeries.hovered().labels().fontColor("#FFFFF");
    columnSeries.hovered().stroke("#ff3b6e")

    this.chart.column([
      { x: 'JG', value: 100, porc: 75 },
    ]).selectionMode("none").tooltip(false).color(ThemeColors.colorPrimary).labels().format("{%value}%").enabled(true).fontColor("#ffffff").fontSize("100%")


    // set title settings
    this.chart
      .title()
      .enabled(false);

    // disable y-axis
    this.chart.yAxis(false);
    this.chart.yGrid(false);

    // set chart x-axis ticks settings
    this.chart.xAxis().ticks().length(30);

    this.chart.xAxis().labels().fontSize(12).fontOpacity(1).fontColor("black").fontWeight(600).hAlign("right");

    this.chart.xGrid().stroke("grey", 1, "2 2");

    // set x-scale
    this.chart.xScale('ordinal');
    this.chart.innerRadius("50%");
    this.chart.background().fill("red", 0);
    let chart = this.chart;
    this.chart.listen('chartDraw', function () {
      let count = chart.xAxis().labels().getLabelsCount();
      for (let i = count / 4; i < count * 3 / 4; i++) {
        let label = chart.xAxis().labels().getLabel(i);
        if (label) {
          label.hAlign("left");
          label.draw();
        }
      }
    });
  }

  ngAfterViewInit() {
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
  }
}
