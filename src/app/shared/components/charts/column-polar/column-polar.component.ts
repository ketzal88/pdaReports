import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Input,
} from '@angular/core';
import 'anychart';
import { MultipleJobCompatibility } from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';

import { disabledCredits } from '../../../utils/chart.util';
import { columnPolarInterface } from '../../interfaces/column-polar-interface';

@Component({
  selector: 'app-column-polar',
  templateUrl: './column-polar.component.html',
  styleUrls: ['./column-polar.component.scss'],
})
export class ColumnPolarComponent implements OnInit, AfterViewInit {
  //Inputs
  @Input() data!: MultipleJobCompatibility[] | undefined;
  @Input() title: string = 'Sr. Developer';

  chart!: anychart.charts.Polar;

  //ViewChilds
  @ViewChild('chartContainer') container: any; //Esto viene del div

  constructor() {}

  ngOnInit(): void {
    //TODO: Quitar Mock
    this.data = this.mockData();
    const newdata: columnPolarInterface[] = this.data
      .filter(x => x.jobTitle !== 'Average' && x.jobTitle !== 'Promedio')
      .map(x => {
        return {
          x: x.individualName,
          value: x.compatibilityPercentage * 100,
        };
      });

    // create polar chart
    this.chart = anychart.polar();

    let columnSeries = this.chart.column(newdata);

    // let columnSeries = this.chart.column([
    //   { x: 'AC', value: 40 },
    //   { x: 'IS', value: 50 },
    //   { x: 'JS', value: 65 },
    //   { x: 'FM', value: 72 },
    //   { x: 'JC', value: 32 },
    //   { x: 'SH', value: 78 },
    //   { x: 'MA', value: 65 },
    //   { x: 'JBL', value: 25 },
    //   { x: 'FD', value: 82 },
    //   { x: 'JPR', value: 65 },
    //   { x: 'SC', value: 91 },
    //   { x: 'HJ', value: 23 },
    //   { x: 'PLG', value: 88 },
    //   { x: 'DC', value: 41 },
    //   { x: 'FGG', value: 35 },
    //   { x: 'PA', value: 69 },
    //   { x: 'DK', value: 10 },
    //   { x: 'JU', value: 27 },
    //   { x: 'LO', value: 80 },
    // ]);

    // set series name
    columnSeries.name('Compatibilidad');

    // disable y-axis
    this.chart.yAxis(false);

    this.chart.yGrid().stroke({
      color: 'white',
      opacity: 0.5,
    });
    this.chart.xGrid().stroke({
      color: 'black',
      thickness: 0.9,
      opacity: 0.5,
      dash: '2 1',
    });
    this.chart.xAxis().stroke({
      color: '#ffffff',
      thickness: 0.5,
    });

    var label = this.chart.label();
    label
      .text(
        '<span style="font-size:15px;font-weight:600;font-family:Poppins;color:#111;">Desarrollador Sr.</span>'
      )
      .useHtml(true)
      .offsetX('50%')
      .offsetY('50%')
      .hAlign('center')
      .vAlign('middle')
      .anchor('center');
    columnSeries.selected({ fill: '#007efd' }).select([2]);
    columnSeries.fill('#EBEFF4');
    columnSeries.stroke('#EBEFF4');

    // set value prefix for tooltip
    this.chart.tooltip().valuePrefix('%');
    this.chart.innerRadius(75);

    // set x-scale
    this.chart.xScale('ordinal');
  }

  ngAfterViewInit(): void {
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
    disabledCredits(this.chart);
  }

  private mockData(): MultipleJobCompatibility[] {
    return [
      {
        jobTitle: 'Test',
        compatibilityPercentage: 0.71,
        image: null,
        individualName: 'Pedro',
      },
      {
        jobTitle: 'Test',
        compatibilityPercentage: 0.33,
        image: null,
        individualName: 'Jose',
      },
      {
        jobTitle: 'Test',
        compatibilityPercentage: 0.4,
        image: null,
        individualName: 'Maria',
      },
      {
        jobTitle: 'Test',
        compatibilityPercentage: 0.23,
        image: null,
        individualName: 'Carlos',
      },
      {
        jobTitle: 'Test',
        compatibilityPercentage: 0.74,
        image: null,
        individualName: 'Batman',
      },
      {
        jobTitle: 'Test',
        compatibilityPercentage: 0.54,
        image: null,
        individualName: 'Alberto',
      },
      {
        jobTitle: 'Test',
        compatibilityPercentage: 0.3,
        image: null,
        individualName: 'Damian',
      },
      {
        jobTitle: 'Test',
        compatibilityPercentage: 0.44,
        image: null,
        individualName: 'Maxi',
      },
      {
        jobTitle: 'Test',
        compatibilityPercentage: 0.97,
        image: null,
        individualName: 'Soria',
      },
    ];
  }
}
