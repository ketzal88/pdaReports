import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { BehavioralAxiCompetency } from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { CorrelationJobBehavioralCompetency } from '../../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import {
  BehavioralRadarChartCompetenciesCompatibility,
  Competency,
} from '../../../../../core/services/microservices/reports/interfaces/pdaGroupSectionsResponse.interface';
import { TippyService } from 'src/app/core/services/tippy.service';

type Polygon = ReturnType<anychart.charts.Polar['polygon']>;

@Component({
  selector: 'app-chart-grafico-comportamental',
  templateUrl: './grafico-comportamental.component.html',
  styleUrls: ['./grafico-comportamental.component.scss'],
})
export class GraficoComportamentalComponent implements OnInit, AfterViewInit {
  constructor(private tippyService: TippyService) {}
  @ViewChild('chartContainer') container!: ElementRef;
  private _correlationJobBehavioralCompetencies: CorrelationJobBehavioralCompetency[];

  @Input()
  get showPuesto(): boolean {
    return this._showPuesto;
  }
  set showPuesto(showPuesto: boolean) {
    this._showPuesto = showPuesto;
    if (this.puesto) {
      this.puesto.enabled(showPuesto);
    }
  }
  private _showPuesto = true;
  @Input()
  get showLider(): boolean {
    return this._showLider;
  }
  set showLider(showLider: boolean) {
    this._showLider = showLider;
    if (this.lider) {
      this.lider.enabled(showLider);
    }
  }
  private _showLider = false;
  @Input()
  get showEquipo(): boolean {
    return this._showEquipo;
  }
  set showEquipo(showEquipo: boolean) {
    this._showEquipo = showEquipo;
    if (this.equipo) {
      this.equipo.enabled(showEquipo);
    }
  }
  private _showEquipo = false;
  @Input()
  get naturalSelected(): boolean {
    return this._naturalSelected;
  }
  set naturalSelected(naturalSelected: boolean) {
    this._naturalSelected = naturalSelected;
    if (this.chart) {
      this.resetChart();
    }
  }
  private _naturalSelected = false;
  @Input() behavioralRadarChart!: BehavioralAxiCompetency[];
  @Input()
  set correlationJobBehavioralCompetencies(
    correlationJobBehavioralCompetencies: CorrelationJobBehavioralCompetency[]
  ) {
    this._correlationJobBehavioralCompetencies =
      correlationJobBehavioralCompetencies;
    if (this.correlationJobBehavioralCompetencies) {
      this.resetChart();
    }
  }

  @Input()
  behavioralRadarChartCompetenciesCompatibility: BehavioralRadarChartCompetenciesCompatibility[];

  @Input() behavioralRadarChartGroupAverageByTeam: Competency[];

  chart!: anychart.charts.Polar;
  persona!: Polygon;
  puesto!: Polygon;
  lider!: Polygon;
  equipo!: Polygon;

  ngOnInit(): void {
    this.createChart();
  }

  ngAfterViewInit(): void {
    if (this.chart) {
      this.chart.container(this.container.nativeElement);
      this.chart.draw();
      let prevIndex = -1;
      let tooltip = undefined;
      this.chart.xAxis().listen('mouseOver', (x: any) => {
        if (!('target' in x && 'dn' in x.target)) {
          return;
        }
        const index = this.calculateIndex(x);
        if (index !== prevIndex) {
          if (tooltip) {
            tooltip.hide();
          }
          prevIndex = index;
          tooltip = this.tippyService.showTooltip(
            this._correlationJobBehavioralCompetencies[index].description
          );
          tooltip.show();
        }
      });
      this.chart.listen('mouseOut', (x: any) => {
        if (
          !(
            'target' in x &&
            'dn' in x.target &&
            Number.isInteger(x.target.dn?.height)
          )
        ) {
          return;
        }
        const index = this.calculateIndex(x);
        if (prevIndex === index && tooltip) {
          prevIndex = -1;
          tooltip.hide();
          tooltip = undefined;
        }
      });

      this.chart.background().listen('mouseOver', (x: any) => {
        if (tooltip) {
          prevIndex = -1;
          tooltip.hide();
          tooltip = undefined;
        }
      });
    }
  }
  calculateIndex(x: any): number {
    const offsetX = x.offsetX;
    const offsetY = x.offsetY;
    const height = x.target.dn.height;
    const width = x.target.dn.width;
    const centerX = width / 2 + x.target.dn.left;
    const centerY = height / 2 + x.target.dn.top;
    const vecX = offsetX - centerX;
    const vecY = offsetY - centerY;
    const vecLenght = Math.sqrt(vecX * vecX + vecY * vecY);
    const normalizedX = vecX / vecLenght;
    const normalizedY = vecY / vecLenght;
    const maxCount = this.chart.xAxis().labels().getLabelsCount();
    const angle = Math.atan2(-normalizedX, normalizedY) / Math.PI;
    return Math.floor((angle + 1) * 0.5 * maxCount);
  }
  createChart(): void {
    let persona = this.behavioralRadarChart.map(x => ({
      x: x.competencyName,
      value: this.naturalSelected ? x.natural : x.role,
    }));
    let puesto =
      this.correlationJobBehavioralCompetencies &&
      persona
        .map((_, i) => this.correlationJobBehavioralCompetencies[i])
        .map((x, i) => ({
          x: this.behavioralRadarChart[i].competencyName,
          value: this.naturalSelected ? x.natural : x.role,
        }));
    // let puesto = this.generateData(persona);
    let lider =
      this.behavioralRadarChartCompetenciesCompatibility &&
      persona
        .map((_, i) => this.behavioralRadarChartCompetenciesCompatibility[i])
        .map((x, i) => ({
          x: this.behavioralRadarChart[i].competencyName,
          value: this.naturalSelected ? x.natural : x.role,
        }));
    // let lider = this.generateData(persona);

    let equipo =
      this.behavioralRadarChartGroupAverageByTeam &&
      persona
        .map((_, i) => this.behavioralRadarChartGroupAverageByTeam[i])
        .map((x, i) => ({
          x: this.behavioralRadarChart[i].competencyName,
          value: this.naturalSelected ? x.natural : x.role,
        }));
    // let equipo = this.generateData(persona);

    let chart = anychart.polar();

    // set title settings
    chart.title().enabled(false);

    // setup chart appearance settings
    chart
      .background('#00000000')
      .sortPointsByX(false)
      .xScale('ordinal')
      .yAxis(false);

    // format chart tooltip
    chart.tooltip(false);

    chart.interactivity(false);

    // set chart grid settings
    chart.yGrid(false);
    chart.xGrid(true);

    // set chart x-axis settings
    chart.xAxis().fill('#EDECEF').stroke('none').overlapMode('auto-width');

    // set chart x-axis ticks settings
    chart.xAxis().ticks().length(0).stroke('#FEFEFE');

    // set chart x-axis labels settings
    chart
      .xAxis()
      .labels()
      .padding(2)
      .fontSize(12)
      .fontOpacity(1)
      .fontWeight(600);

    this.persona = this.createPolygon(persona, chart, '#d213f1');
    this.puesto = this.createPolygon(puesto, chart, '#007efd');
    this.lider = this.createPolygon(lider, chart, '#01DAD8');
    this.equipo = this.createPolygon(equipo, chart, '#FFA902');

    this.puesto.enabled(this.showPuesto);
    this.lider.enabled(this.showLider);
    this.equipo.enabled(this.showEquipo);

    chart
      .xAxis()
      .labels()
      .fontSize(window.innerWidth <= 440 ? 7 : 10);

    // workaround to make even/odd xAxis labels coloring
    chart.listen('chartDraw', function () {
      let count = chart.xAxis().labels().getLabelsCount();
      for (let i = 0; i < count; i++) {
        let color = '#2e2e2e';
        switch (i) {
          case 2:
            color = '#deb709';
            break;
          case 6:
            color = '#0eb1f2';
            break;
          case 10:
            color = '#33b13e';
            break;
          case 14:
            color = '#fd752c';
            break;
        }
        let label = chart.xAxis().labels().getLabel(i);

        if (label) {
          if (window.innerWidth <= 440) {
            label.fontSize(7);
            label.adjustFontSize(true, false);
          } else {
            label.fontSize(10);
          }
          label.fontColor(color);
          label.draw();
        }
      }
    });

    chart.listen('chartDraw', function () {
      chart
        .xAxis()
        .labels()
        .fontSize(window.innerWidth <= 440 ? 7 : 10);
    });

    this.chart = chart;
  }

  generateData(examples: { x: string; value: number }[]): any {
    const max = Math.max(...examples.map(x => x.value));
    const min = Math.min(...examples.map(x => x.value));
    return examples.map(x => ({
      x: x.x,
      value: min + Math.random() * (max - min),
    }));

    // return [
    //   { x: "Iniciativa", value: Math.random() + 0.5 },
    //   { x: "Persuasión", value: Math.random() + 0.5 },
    //   { x: "Influencia", value: Math.random() + 0.5 },
    //   { x: "Autonomía", value: Math.random() + 0.5 },
    //   { x: "Asesoramiento", value: Math.random() + 0.5 },
    //   { x: "Servicio y soporte", value: Math.random() + 0.5 },
    //   { x: "Amabilidad", value: Math.random() + 0.5 },
    //   { x: "Paciencia", value: Math.random() + 0.5 },
    //   { x: "Precisión", value: Math.random() + 0.5 },
    //   { x: "Concentración", value: Math.random() + 0.5 },
    //   { x: "Análisis", value: Math.random() + 0.5 },
    //   { x: "Obediencia", value: Math.random() + 0.5 },
    //   { x: "Implementación", value: Math.random() + 0.5 },
    //   { x: "Dinamismo", value: Math.random() + 0.5 },
    //   { x: "Determinación", value: Math.random() + 0.5 },
    //   { x: "Expeditividad", value: Math.random() + 0.5 },
    // ];
  }

  createPolygon(
    data: ReturnType<GraficoComportamentalComponent['generateData']>,
    chart: anychart.charts.Polar,
    color: string
  ): any {
    let polygon = chart.polygon(data);
    polygon
      .name('Polygon')
      .fill(color + '04')
      .stroke(color, 3)
      .zIndex(31);
    polygon.hovered().markers(false);
    polygon.selectionMode('none');
    return polygon;
  }

  togglePolygon(polygon: Polygon): void {
    polygon.enabled(!polygon.enabled());
  }

  resetChart(): any {
    // if (this.chart) {
    //   this.chart.dispose();
    // }
    // this.createChart();
    if (this.container) {
      let persona = this.behavioralRadarChart.map(x => ({
        x: x.competencyName,
        value: this.naturalSelected ? x.natural : x.role,
      }));

      let puesto =
        this.correlationJobBehavioralCompetencies &&
        persona
          .map((_, i) => this.correlationJobBehavioralCompetencies[i])
          .map((x, i) => ({
            x: this.behavioralRadarChart[i].competencyName,
            value: this.naturalSelected ? x.natural : x.role,
          }));
      // let puesto = this.generateData(persona);
      let lider =
        this.behavioralRadarChartCompetenciesCompatibility &&
        persona
          .map((_, i) => this.behavioralRadarChartCompetenciesCompatibility[i])
          .map((x, i) => ({
            x: this.behavioralRadarChart[i].competencyName,
            value: this.naturalSelected ? x.natural : x.role,
          }));
      // let lider = this.generateData(persona);

      let equipo =
        this.behavioralRadarChartGroupAverageByTeam &&
        persona
          .map((_, i) => this.behavioralRadarChartGroupAverageByTeam[i])
          .map((x, i) => ({
            x: this.behavioralRadarChart[i].competencyName,
            value: this.naturalSelected ? x.natural : x.role,
          }));

      this.persona.data(persona);
      this.puesto.data(puesto);
      this.lider.data(lider);
      this.equipo.data(equipo);

      this.puesto.enabled(this.showPuesto);
      this.lider.enabled(this.showLider);
      this.equipo.enabled(this.showEquipo);

      this.chart.draw();
    }
  }

  get correlationJobBehavioralCompetencies(): CorrelationJobBehavioralCompetency[] {
    return this._correlationJobBehavioralCompetencies;
  }
}
