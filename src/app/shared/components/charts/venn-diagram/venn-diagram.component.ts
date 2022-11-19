import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core';
import { disabledCredits } from '../../../utils/chart.util';
import { JobCategory } from '../../../../core/services/microservices/job/job.interface';
import {
  JobCompatibilityDetailed,
  MultipleJobCompatibility,
} from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';

@Component({
  selector: 'app-venn-diagram',
  templateUrl: './venn-diagram.component.html',
  styleUrls: ['./venn-diagram.component.scss'],
})
export class VennDiagramComponent implements OnInit, AfterViewInit {
  @Input() jobCompatibilityDetailed: JobCompatibilityDetailed;
  @Input() multipleJobCompatibility: MultipleJobCompatibility[];
  @Input() jobCategory: JobCategory;

  chart!: any;
  //ViewChilds
  @ViewChild('chartContainer') container: any;

  constructor() {}

  ngOnInit(): void {
    let dataVenn = this.getData();

    // create a chart and set the data
    this.chart = anychart.venn(dataVenn);

    // configure the visual settings of the chart
    this.chart.normal().fill('#fff');
    this.chart.hovered().fill('#fff');
    this.chart.selected().fill('#fff', 0.5);

    this.chart.normal().stroke('#EBEFF4', 14);
    this.chart.hovered().stroke('#EBEFF4', 14);
    this.chart.selected().stroke('#EBEFF4', 14);

    // disable labels of intersections
    this.chart.intersections().labels(false);

    // disable the legend
    this.chart.legend(false);

    // configure labels of circles
    this.chart

      .labels()
      .fontWeight('bold')
      .hAlign('center')
      .vAlign('center')
      .fontFamily('Poppins')
      .fontColor('#000')
      .adjustFontSize(true, false)
      .maxFontSize(60)
      .minFontSize(2)
      .wordBreak('break-word')
      .useHtml(true)
      .format(function () {
        return (
          '<span style="font-size:36px;font-weight:bold;">' +
          this.getData('custom_field1') +
          ' <br>' +
          '<span style="font-size:12px;text-align:center;">' +
          this.getData('custom_field2')
        );
      });

    this.chart.tooltip().padding().left(20);

    // bg color
    this.chart.tooltip().background().fill('#fff');
    this.chart.tooltip().fontColor('#000');
    // this.chart.tooltip().format('Dinámico Cordial Comunicativo');
    this.chart.tooltip().format(function () {
      return this.getData('custom_field3');
    });
  }
  ngAfterViewInit(): void {
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
    disabledCredits(this.chart);
  }

  getData(): any[] {
    let dataVenn: any[] = [
      {
        x: String.fromCharCode(65),
        value: 100,
        custom_field1: this.jobCategory?.name,
        custom_field2: '',
        custom_field3: this.jobCategory?.name,
        normal: {
          fill: '#fff',
          stroke: '14 #007efd',
        },
        selected: {
          fill: '#fff',
          stroke: '14 #007efd',
        },
        hovered: {
          fill: '#fff',
          stroke: '14 #007efd',
        },
      },
    ];

    let datamultipleJob = this.multipleJobCompatibility?.reduce(
      (newValue: any, currentValue: MultipleJobCompatibility, idx: number) => {
        if (idx > 0) {
          let item: any = {};
          item.x = String.fromCharCode(65 + idx);
          item.value = Number(
            currentValue.compatibilityPercentage * 100
          ).toFixed(0);
          item.custom_field1 =
            Number(currentValue.compatibilityPercentage * 100).toFixed(0) + '%';
          item.custom_field2 = currentValue.jobTitle.substring(0, 20);
          item.custom_field3 = currentValue.jobTitle;
          if (
            currentValue.jobTitle.includes(
              this.jobCompatibilityDetailed.jobTitle
            )
          ) {
            item.normal = {};
            item.normal.fill = '#fff';
            item.normal.stroke = '14 #007efd';
            item.selected = {};
            item.selected.fill = '#fff';
            item.selected.stroke = '14 #007efd';
            item.hovered = {};
            item.hovered.fill = '#fff';
            item.hovered.stroke = '14 #007efd';
          }
          newValue.push(item);
        }
        return newValue;
      },
      []
    );
    dataVenn = [...dataVenn, ...datamultipleJob];
    return dataVenn;
  }
}
