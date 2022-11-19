import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core';
import {
  BalanceAgeGenderLocal,
  ContentAgeGender,
} from '../../age-gender-balance/interfaces/balance-age-gender-local.interface';

@Component({
  selector: 'app-chart-balance-edad-genero',
  templateUrl: './balance-edad-genero.component.html',
  styleUrls: ['./balance-edad-genero.component.scss'],
})
export class BalanceEdadGeneroComponent implements OnInit, AfterViewInit {
  //Variables
  chart!: anychart.charts.Cartesian;

  //Inputs
  @Input() balanceLocal: BalanceAgeGenderLocal[];

  //ViewChild
  @ViewChild('chartContainer') container!: ElementRef;

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    // let dataSet = anychart.data.set([
    //   ['18 a 30', 40, 0, 60],
    //   ['31 a 45', 15, 25, 60],
    //   ['46 a 59', 10, 40, 50],
    //   ['+60', 50, 3, 47],
    // ]);
    //TODO-WORKER: Dado el grafico,
    let dataSet = anychart.data.set(this.getMappedData());

    // map data for the first series, take x from the zero column and value from the first column of data set
    let seriesData_1 = dataSet.mapAs({ x: 0, value: 1 });

    // map data for the second series, take x from the zero column and value from the second column of data set
    let seriesData_2 = dataSet.mapAs({ x: 0, value: 2 });

    // map data for the second series, take x from the zero column and value from the third column of data set
    let seriesData_3 = dataSet.mapAs({ x: 0, value: 3 });

    // map data for the fourth series, take x from the zero column and value from the fourth column of data set
    let seriesData_4 = dataSet.mapAs({ x: 0, value: 4 });

    // create bar chart
    this.chart = anychart.column();

    // turn on chart animation
    this.chart.animation(true);
    this.chart.interactivity().selectionMode('none');

    // force chart to stack values by Y scale.
    this.chart.yScale().stackMode('percent');

    // set yAxis labels formatting, force it to add % to values
    this.chart.yAxis(0).labels().format('{%Value}%');
    this.chart.xAxis(0, { ticks: false, labels: true, stroke: '#ffffff' });
    this.chart.yAxis(0, { ticks: false, labels: false, stroke: '#ffffff' });

    // temp letiable to store series instance
    let series = this.chart.column(seriesData_1);
    series.fill('#5DE4E4');
    this.setupSeries(
      series,
      this.translateService.instant(
        `REPORTS.SECTIONS.AGE_GENDER_BALANCE.LABELS.NO_BINARY`
      )
    );

    // create second series with mapped data
    series = this.chart.column(seriesData_2);
    series.fill('#E6A0F2');
    this.setupSeries(
      series,
      this.translateService.instant(
        `REPORTS.SECTIONS.AGE_GENDER_BALANCE.LABELS.FEMALE`
      )
    );

    // create third series with mapped data
    series = this.chart.column(seriesData_3);
    series.fill('#FFA902');
    this.setupSeries(
      series,
      this.translateService.instant(
        `REPORTS.SECTIONS.AGE_GENDER_BALANCE.LABELS.MALE`
      )
    );

    // create third series with mapped data
    series = this.chart.column(seriesData_4);
    series.fill('#C3C4CA');
    this.setupSeries(series, 'Vacío');

    this.chart.interactivity().hoverMode('by-x');
    this.chart.tooltip().displayMode('union');
    this.chart.tooltip(false);

    this.chart.pointWidth(18);
  }

  ngAfterViewInit(): void {
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
  }

  getMappedData(): any[] {
    return this.balanceLocal.reduce(
      (newValue: any, currentValue: BalanceAgeGenderLocal, index: number) => {
        if (
          currentValue.contentAgeGender.reduce(
            (prev, cur) => cur.percentage + prev,
            0
          ) === 0
        ) {
          newValue.push([
            this.translateService.instant(
              `REPORTS.SECTIONS.AGE_GENDER_BALANCE.AGE_TITLE.${currentValue.labelAgeGender}`
            ),
            0,
            0,
            0,
            100,
          ]);
          return newValue;
        }
        let newData = [
          this.translateService.instant(
            `REPORTS.SECTIONS.AGE_GENDER_BALANCE.AGE_TITLE.${currentValue.labelAgeGender}`
          ),
          ...currentValue.contentAgeGender.map((item: ContentAgeGender) => {
            return item.percentage;
          }),
        ];
        newValue.push(newData);
        return newValue;
      },
      []
    );
  }

  // helper function to setup label settings for all series
  setupSeries(
    series: anychart.core.cartesian.series.Column,
    name: string
  ): void {
    series.stroke('2 #fff 1');
    if (name && name.length > 0) {
      series.name(name);
      series.hovered().stroke('2 #fff 1');
      series.tooltip().titleFormat('{%Name}');
    }

    let shapes = series.rendering().shapes();
    series
      .rendering()
      // set point function to drawing
      .point(this.drawer)
      // set update point function to drawing, change the point shape when the state changes
      .updatePoint(this.drawer)
      // set shapes
      .shapes(shapes);
  }

  drawer(this: anychart.core.series.RenderingSettings.Context | any): void {
    // if missing (not correct data), then skipping this point drawing
    if (this.missing) {
      return;
    }
    // get shapes group
    let path = (this.shapes || this.getShapesGroup(this.pointState))
      .path as anychart.graphics.vector.Path;
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
}
