import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ThemeColors } from '../../themes/blue';


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
    let columnSeries = this.chart.column([
      { x: "IS", value: 70 },
      { x: "JS", value: 70 },
      { x: "JG", value: 0 },
      { x: "JC", value: 70 },
      { x: "SH", value: 70 },
      { x: "MA", value: 70 },
      { x: "JBL", value: 70 },
      { x: "FD", value: 50 },
      { x: "JPR", value: 70 },
      { x: "SC", value: 70 },
      { x: "MHM", value: 70 },
      { x: "HJ", value: 70 },
      { x: "PLG", value: 70 },
      { x: "DC", value: 70 },
      { x: "FGG", value: 70 },
      { x: "PA", value: 70 },
      { x: "DK", value: 70 },
      { x: "JU", value: 70 },
      { x: "LO", value: 70 },
      { x: "AC", value: 100 },
    ]).tooltip(false);
    columnSeries.color("#cccccc88").labels().format("{%value}%").enabled(false).fontColor("#ddddd").fontSize("100%");
    columnSeries.selected().fill("#ff4b7e").selected().labels().enabled(true);

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
    this.chart.innerRadius(150);
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
