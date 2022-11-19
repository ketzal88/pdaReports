import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { BehavioralAxiCompetency } from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { disabledCredits } from '../../../utils/chart.util';
import { CorrelationJobBehavioralCompetency } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import {
  BehavioralRadarChartCompetenciesCompatibility,
  Competency,
} from '../../../../core/services/microservices/reports/interfaces/pdaGroupSectionsResponse.interface';

@Component({
  selector: 'app-stacked-polygon-polar',
  templateUrl: './stacked-polygon-polar.component.html',
  styleUrls: ['./stacked-polygon-polar.component.scss'],
})
export class StackedPolygonPolarComponent
  implements OnInit, OnChanges, AfterViewInit
{
  //bindings
  private chart!: anychart.charts.Polar;
  private _correlationJobBehavioralCompetencies: CorrelationJobBehavioralCompetency[];

  //Inputs
  @Input() behavioralRadarChart!: BehavioralAxiCompetency[];
  @Input()
  set correlationJobBehavioralCompetencies(
    correlationJobBehavioralCompetencies: CorrelationJobBehavioralCompetency[]
  ) {
    this._correlationJobBehavioralCompetencies =
      correlationJobBehavioralCompetencies;
    if (this.correlationJobBehavioralCompetencies && this.chart) {
      this.chart.dispose();
      this.loadChartData();
      this.showChart();
    }
  }

  @Input() naturalSelected: boolean;

  @Input()
  behavioralRadarChartCompetenciesCompatibility: BehavioralRadarChartCompetenciesCompatibility[];

  @Input() behavioralRadarChartGroupAverageByTeam: Competency[];

  //ViewChilds
  @ViewChild('chartContainer') container: any;
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['naturalSelected'] !== undefined) {
      this.naturalSelected = changes['naturalSelected'].currentValue;
      if (this.chart) {
        this.chart.dispose();
        this.loadChartData();
        this.showChart();
      }
    }
  }

  ngOnInit(): void {
    this.loadChartData();
  }

  ngAfterViewInit(): void {
    this.showChart();
  }

  loadChartData(): void {
    let dataTable: any[] = this.getDataTable();

    // create polar chart
    this.chart = anychart.polar();
    let data = anychart.data.mapAsTable([...dataTable]);

    // sort data by X
    this.chart
      .defaultSeriesType('polygon')
      // disable y-axis
      .yAxis(false)
      // set x-scale
      .xScale('ordinal');

    // set chart x-axis settings
    this.chart.xAxis().fill('#EBEFF4').stroke('none').overlapMode('auto-width');
    this.chart.xAxis().labels().padding(4).fontSize(11).hAlign('center');
    this.chart.polygon(data);

    // add series to chart
    this.chart.addSeries.apply(this.chart, data);
  }

  getDataTable(): any[] {
    let dataTable: any[] = this.behavioralRadarChart.reduce(
      (antValue: any, currentValue: any, index: number) => {
        let newData = [
          currentValue.competencyName,
          this.naturalSelected
            ? currentValue.natural * 1000
            : currentValue.role * 1000,
        ];
        antValue.push(newData);
        return antValue;
      },
      []
    );

    dataTable = [...this.getInfoByDataType(dataTable)];

    return dataTable;
  }

  getInfoByDataType(dataTable: any[]): any[] {
    if (
      this.correlationJobBehavioralCompetencies &&
      this.correlationJobBehavioralCompetencies.length > 0
    ) {
      for (let idx = 0; idx < this.behavioralRadarChart.length; idx++) {
        dataTable[idx].push(
          this.correlationJobBehavioralCompetencies[idx]?.natural * 1000
        );
      }
    }

    if (
      this.behavioralRadarChartCompetenciesCompatibility &&
      this.behavioralRadarChartCompetenciesCompatibility.length > 0
    ) {
      for (let idx = 0; idx < this.behavioralRadarChart.length; idx++) {
        dataTable[idx].push(
          this.behavioralRadarChartCompetenciesCompatibility[idx]?.natural *
            1000
        );
      }
    }

    if (
      this.behavioralRadarChartGroupAverageByTeam &&
      this.behavioralRadarChartGroupAverageByTeam.length > 0
    ) {
      for (let idx = 0; idx < this.behavioralRadarChart.length; idx++) {
        dataTable[idx].push(
          this.behavioralRadarChartGroupAverageByTeam[idx]?.natural * 1000
        );
      }
    }

    return dataTable;
  }

  showChart(): void {
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
    disabledCredits(this.chart);
  }

  get correlationJobBehavioralCompetencies(): CorrelationJobBehavioralCompetency[] {
    return this._correlationJobBehavioralCompetencies;
  }
}
