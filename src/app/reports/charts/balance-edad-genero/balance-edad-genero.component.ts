import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'chart-balance-edad-genero',
  templateUrl: './balance-edad-genero.component.html',
  styleUrls: ['./balance-edad-genero.component.scss']
})
export class BalanceEdadGeneroComponent implements OnInit {

  constructor() { }
  @ViewChild('chartContainer') container!: ElementRef;

  chart!: anychart.charts.Cartesian;

  ngOnInit(): void {
    let dataSet = anychart.data.set([
      ['18 a 30', 20, 40, 40],
      ['31 a 45', 15, 25, 60],
      ['46 a 59', 10, 40, 50],
      ['+60', 50, 3, 47],
    ]);

    // map data for the first series, take x from the zero column and value from the first column of data set
    let seriesData_1 = dataSet.mapAs({ 'x': 0, 'value': 1 });

    // map data for the second series, take x from the zero column and value from the second column of data set
    let seriesData_2 = dataSet.mapAs({ 'x': 0, 'value': 2 });

    // map data for the second series, take x from the zero column and value from the third column of data set
    let seriesData_3 = dataSet.mapAs({ 'x': 0, 'value': 3 });

    // map data for the fourth series, take x from the zero column and value from the fourth column of data set
    // let seriesData_4 = dataSet.mapAs({'x': 0, 'value': 4});

    // create bar chart
    this.chart = anychart.column();

    // turn on chart animation
    this.chart.animation(true);
    this.chart.interactivity().selectionMode("none");

    // force chart to stack values by Y scale.
    this.chart.yScale().stackMode('percent');

    // set yAxis labels formatting, force it to add % to values
    this.chart.yAxis(0).labels().format("{%Value}%");
    this.chart.xAxis(0, { ticks: false, labels: true, stroke: '#ffffff' });
    this.chart.yAxis(0, { ticks: false, labels: false, stroke: '#ffffff' });

    // helper function to setup label settings for all series
    let setupSeries = function (series: anychart.core.cartesian.series.Column, name: string) {
      series.stroke('2 #fff 1');
      series.name(name);
      series.hovered().stroke('2 #fff 1');
      series.tooltip().titleFormat("{%Name}");

      let shapes = series.rendering().shapes();
      series.rendering()
        // set point function to drawing
        .point(drawer)
        // set update point function to drawing, change the point shape when the state changes
        .updatePoint(drawer)
        // set shapes
        .shapes(shapes);
    };
    let drawer = function (this: anychart.core.series.RenderingSettings.Context | any) {
      // if missing (not correct data), then skipping this point drawing
      if (this.missing) {
        return;
      }
      // get shapes group
      let path = (this.shapes || this.getShapesGroup(this.pointState)).path as anychart.graphics.vector.Path;
      // calculate the left value of the x-axis
      let leftX = this.x - this.pointWidth / 2;
      // calculate the right value of the x-axis
      let rightX = leftX + this.pointWidth;
      // calculate the half of point width
      let rx = this.pointWidth / 2;

      if (this.zero - this.value - rx < -4) {
        path
          // resets all 'line' operations
          .clear();
          return;
      }
      path
        // resets all 'line' operations
        .clear()
        // draw column with rounded edges
        .moveTo(leftX, this.zero - rx) //esq izq
        .lineTo(leftX, this.value + rx)
        .circularArc(leftX + rx, this.value + rx, rx, rx, 180, 180)
        .lineTo(rightX, this.zero - rx)
        .circularArc(leftX + rx, this.zero - rx, rx, rx, 0, 180)
        // .lineTo(rightX, this.zero)
        // close by connecting the last point with the first straight line
        .close();
    }

    // temp letiable to store series instance
    let series = this.chart.column(seriesData_1);
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

  ngAfterViewInit() {
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
  }
}
