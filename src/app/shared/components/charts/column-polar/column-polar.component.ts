import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Input,
} from '@angular/core';
import { JobCompatibilityFromGroup } from 'src/app/core/services/microservices/reports/interfaces/pdaGroupSectionsResponse.interface';

import { disabledCredits } from '../../../utils/chart.util';
import { columnPolarInterface } from '../interfaces/column-polar-interface';
import { getIndividualShortName } from '../../../../core/utils/strings.util';

@Component({
  selector: 'app-column-polar',
  templateUrl: './column-polar.component.html',
  styleUrls: ['./column-polar.component.scss'],
})
export class ColumnPolarComponent implements OnInit, AfterViewInit {
  //Inputs
  @Input() data!: JobCompatibilityFromGroup[] | undefined;
  @Input() selectedIndividualId: string;
  @Input() jobTitle: string = '';

  chart!: anychart.charts.Polar;

  //ViewChilds
  @ViewChild('chartContainer') container: any; //Esto viene del div

  constructor() {}

  ngOnInit(): void {
    //this.data = this.mockData();  //MOCK
    this.jobTitle = this.data[0].jobTitle;

    let newdata: columnPolarInterface[] = this.data.map(x => {
      return {
        x: getIndividualShortName(x.individualName),
        value: x.compatibilityPercentage * 100,
        tooltip: x.individualName,
        fieldId: x.individualId,
      };
    });

    //Cambiar a true cuando me manden el individualId
    if (this.selectedIndividualId) {
      newdata.forEach(function (individualCompatibility, i) {
        if (
          individualCompatibility.fieldId &&
          individualCompatibility.fieldId === this.selectedIndividualId
        ) {
          newdata.splice(i, 1);
          newdata.unshift(individualCompatibility);
        }
      }, this.selectedIndividualId);
    }

    // create polar chart
    this.chart = anychart.polar();

    let columnSeries = this.chart.column(newdata);

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
        `<span style="font-size:15px;font-weight:600;font-family:Poppins;color:#111;">${this.jobTitle}</span>`
      )
      .useHtml(true)
      .width('28%')
      .height('20%')
      .offsetX('50%')
      .offsetY('50%')
      .hAlign('center')
      .vAlign('middle')
      .textOverflow(' ')
      .anchor('center');

    if (this.selectedIndividualId) {
      columnSeries.select(0);
    }
    columnSeries.selected({ fill: '#007efd' });
    columnSeries.fill('#EBEFF4');
    columnSeries.stroke('#EBEFF4');

    // set value prefix for tooltip
    //this.chart.tooltip().valuePrefix('');
    let tooltip = this.chart.tooltip();
    tooltip.useHtml(true);
    tooltip.separator(false);
    tooltip.title().enabled(false);
    tooltip.format('{%tooltip} <br/> <b>{%value}</b> ');

    this.chart.innerRadius(85);

    // set x-scale
    this.chart.xScale('ordinal');
  }

  ngAfterViewInit(): void {
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
    disabledCredits(this.chart);
  }

  private mockData(): JobCompatibilityFromGroup[] {
    return [
      {
        jobId: '01',
        jobTitle: 'Test',
        compatibilityPercentage: 0.71,
        image: null,
        individualName: 'Pedro',
      },
      {
        jobId: '01',
        jobTitle: 'Test',
        compatibilityPercentage: 0.33,
        image: null,
        individualName: 'Jose',
      },
      {
        jobId: '01',
        jobTitle: 'Test',
        compatibilityPercentage: 0.4,
        image: null,
        individualName: 'Maria',
      },
      {
        jobId: '01',
        jobTitle: 'Test',
        compatibilityPercentage: 0.23,
        image: null,
        individualName: 'Carlos',
      },
      {
        jobId: '01',
        jobTitle: 'Test',
        compatibilityPercentage: 0.74,
        image: null,
        individualName: 'Batman',
      },
      {
        jobId: '01',
        jobTitle: 'Test',
        compatibilityPercentage: 0.54,
        image: null,
        individualName: 'Alberto',
      },
      {
        jobId: '01',
        jobTitle: 'Test',
        compatibilityPercentage: 0.3,
        image: null,
        individualName: 'Damian',
      },
      {
        jobId: '01',
        jobTitle: 'Test',
        compatibilityPercentage: 0.44,
        image: null,
        individualName: 'Maxi',
      },
      {
        jobId: '01',
        jobTitle: 'Test',
        compatibilityPercentage: 0.97,
        image: null,
        individualName: 'Soria',
      },
    ];
  }
}
