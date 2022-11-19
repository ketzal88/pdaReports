import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { REPNA } from 'src/app/core/models/repna.model';
import { disabledCredits } from '../../../utils/chart.util';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss'],
})
export class BubbleChartComponent implements OnInit, OnChanges, AfterViewInit {
  private colorInactive: string = '#DBDBDB';
  private colorR: string = '#ff6819 1';
  private colorE: string = '#FFD100 1';
  private colorP: string = '#27ACF7 1';
  private colorN: string = '#2FB039 1';
  private colorA: string = '#8C24D2 1';

  @Input() naturalREPNA: REPNA;
  @Input() roleREPNA: REPNA;
  @Input() naturalSelected: boolean;
  @Input() tooltipsRepna: any[];

  chart!: anychart.charts.Cartesian;
  names!: any;
  series!: any;

  @ViewChild('chartContainer') container: any; //Esto viene del div

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['naturalSelected'] !== undefined) {
      this.naturalSelected = changes['naturalSelected'].currentValue;
      if (this.chart) {
        this.chart.dispose();
        this.ngOnInit();
        this.ngAfterViewInit();
      }
    }
  }

  ngOnInit(): void {
    // create a chart
    this.chart = anychart.cartesian();
    this.chart.interactivity(false);
    this.chart.tooltip(false);
    
    this.chart.xAxis(0, { ticks: false, labels: false, stroke: '#ffffff00' });
    this.chart.yAxis(0, { ticks: false, labels: false, stroke: '#ffffff00' });

    let natural: anychart.core.cartesian.series.Bubble[] = [];
    let role: anychart.core.cartesian.series.Bubble[] = [];
    //UNSELECTED CHART
    if (this.naturalSelected) {
      natural = this.drawNaturalSeries();
    } else {
      role = this.drawRoleSeries();
    }

    //SPACER
    this.drawResizingSeries();
    this.drawMediaSeries();

    //Media Line

    //SELECTED CHART
    if (!this.naturalSelected) {
      natural = this.drawNaturalSeries();
    } else {
      role = this.drawRoleSeries();
    }
    let fontSize = '24px';
    if (window.innerWidth <= 440) {
      fontSize = '16px';
    } else if (window.innerWidth <= 1200) {
      fontSize = '20px';
    }
    role.forEach((element: anychart.core.cartesian.series.Bubble) => {
      element.labels().fontSize(fontSize);
    });
    natural.forEach((element: anychart.core.cartesian.series.Bubble) => {
      element.labels().fontSize(fontSize);
    });
    this.chart.listen('chartDraw', function () {
      fontSize = '24px';
      if (window.innerWidth <= 440) {
        fontSize = '16px';
      } else if (window.innerWidth <= 1200) {
        fontSize = '20px';
      }
      role.forEach((element: anychart.core.cartesian.series.Bubble) => {
        element.labels().fontSize(fontSize);
      });
      natural.forEach((element: anychart.core.cartesian.series.Bubble) => {
        element.labels().fontSize(fontSize);
      });
    });
    this.chart.maxBubbleSize('9%');
  }

  ngAfterViewInit(): void {
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
    disabledCredits(this.chart);
  }

  drawNaturalSeries(): anychart.core.cartesian.series.Bubble[] {
    const naturalLine0 = [
      { x: 0, value: this.naturalREPNA.rValue },
      { x: 15, value: this.naturalREPNA.eValue },
      { x: 30, value: this.naturalREPNA.pValue },
      { x: 45, value: this.naturalREPNA.nValue },
    ];

    const naturalR = [
      {
        x: 0,
        value: this.naturalREPNA.rValue,
        size: 1,
        name: this.naturalREPNA.rName,
      },
    ];
    const naturalE = [
      {
        x: 15,
        value: this.naturalREPNA.eValue,
        size: 1,
        name: this.naturalREPNA.eName,
      },
    ];
    const naturalP = [
      {
        x: 30,
        value: this.naturalREPNA.pValue,
        size: 1,
        name: this.naturalREPNA.pName,
      },
    ];
    const naturalN = [
      {
        x: 45,
        value: this.naturalREPNA.nValue,
        size: 1,
        name: this.naturalREPNA.nName,
      },
    ];
    const naturalA = [
      {
        x: 60,
        value: this.naturalREPNA.aValue,
        size: 1,
        name: this.naturalREPNA.aName,
      },
    ];

    this.chart
      .line(naturalLine0)
      .stroke('#88868b', this.naturalSelected ? 1 : 0.3)
      .zIndex(this.naturalSelected ? 101 : 0);

    let serieNaturalR = this.chart.bubble(naturalR);
    this.setLabelFormatAndBubbleStyle(
      serieNaturalR,
      this.colorR,
      this.naturalSelected
    );

    let serieNaturalE = this.chart.bubble(naturalE);
    this.setLabelFormatAndBubbleStyle(
      serieNaturalE,
      this.colorE,
      this.naturalSelected
    );

    let serieNaturalP = this.chart.bubble(naturalP);
    this.setLabelFormatAndBubbleStyle(
      serieNaturalP,
      this.colorP,
      this.naturalSelected
    );

    let serieNaturalN = this.chart.bubble(naturalN);
    this.setLabelFormatAndBubbleStyle(
      serieNaturalN,
      this.colorN,
      this.naturalSelected
    );

    let serieNaturalA = this.chart.bubble(naturalA);
    this.setLabelFormatAndBubbleStyle(
      serieNaturalA,
      this.colorA,
      this.naturalSelected
    );

    if (this.naturalSelected) {
      this.setRedBorder(serieNaturalP);
    }
    return [
      serieNaturalR,
      serieNaturalE,
      serieNaturalP,
      serieNaturalN,
      serieNaturalA,
    ];
  }
  drawRoleSeries(): anychart.core.cartesian.series.Bubble[] {
    const roleLine0 = [
      { x: 0, value: this.roleREPNA.rValue },
      { x: 15, value: this.roleREPNA.eValue },
      { x: 30, value: this.roleREPNA.pValue },
      { x: 45, value: this.roleREPNA.nValue },
    ];

    const roleR = [
      {
        x: 0,
        value: this.roleREPNA.rValue,
        size: 1,
        name: this.roleREPNA.rName,
      },
    ];
    const roleE = [
      {
        x: 15,
        value: this.roleREPNA.eValue,
        size: 1,
        name: this.roleREPNA.eName,
      },
    ];
    const roleP = [
      {
        x: 30,
        value: this.roleREPNA.pValue,
        size: 1,
        name: this.roleREPNA.pName,
      },
    ];
    const roleN = [
      {
        x: 45,
        value: this.roleREPNA.nValue,
        size: 1,
        name: this.roleREPNA.nName,
      },
    ];
    const roleA = [
      {
        x: 60,
        value: this.roleREPNA.aValue,
        size: 1,
        name: this.roleREPNA.aName,
      },
    ];

    this.chart
      .line(roleLine0)
      .stroke('#88868b', !this.naturalSelected ? 1 : 0.3)
      .zIndex(!this.naturalSelected ? 101 : 0);

    this.chart.background('#00000000');

    let serieRoleR = this.chart.bubble(roleR);
    this.setLabelFormatAndBubbleStyle(
      serieRoleR,
      this.colorR,
      !this.naturalSelected
    );

    let serieRoleE = this.chart.bubble(roleE);
    this.setLabelFormatAndBubbleStyle(
      serieRoleE,
      this.colorE,
      !this.naturalSelected
    );

    let serieRoleP = this.chart.bubble(roleP);
    this.setLabelFormatAndBubbleStyle(
      serieRoleP,
      this.colorP,
      !this.naturalSelected
    );
    let serieRoleN = this.chart.bubble(roleN);
    this.setLabelFormatAndBubbleStyle(
      serieRoleN,
      this.colorN,
      !this.naturalSelected
    );

    let serieRoleA = this.chart.bubble(roleA);
    this.setLabelFormatAndBubbleStyle(
      serieRoleA,
      this.colorA,
      !this.naturalSelected
    );

    if (!this.naturalSelected) {
      this.setRedBorder(serieRoleP);
    }
    return [serieRoleR, serieRoleE, serieRoleP, serieRoleN, serieRoleA];
  }
  drawResizingSeries(): void {
    /* ESTE DATO NO SE USA, ES SOLO PARA LOGRAR QUE SE MUESTREN LAS BURBUJAS EN 0*/
    const dataResizing = [{ x: 75, value: -30, size: 1 }];
    let serieResizing = this.chart.bubble(dataResizing);
    serieResizing.normal().fill('#fff');
    serieResizing.normal().stroke('#fff', 1);
  }
  drawMediaSeries(): void {
    const mediaLine = this.naturalSelected
      ? [
          { x: 0, value: this.naturalREPNA.mediaValue },
          { x: 15, value: this.naturalREPNA.mediaValue },
          { x: 30, value: this.naturalREPNA.mediaValue },
          { x: 45, value: this.naturalREPNA.mediaValue },
          { x: 60, value: this.naturalREPNA.mediaValue },
        ]
      : [
          { x: 0, value: this.roleREPNA.mediaValue },
          { x: 15, value: this.roleREPNA.mediaValue },
          { x: 30, value: this.roleREPNA.mediaValue },
          { x: 45, value: this.roleREPNA.mediaValue },
          { x: 60, value: this.roleREPNA.mediaValue },
        ];
    // this.chart.line(mediaLine).stroke('#ff4040', 1);
  }

  setLabelFormatAndBubbleStyle(
    serie: anychart.core.cartesian.series.Bubble,
    color: string,
    isEnabled: boolean
  ): void {
    color = isEnabled ? color : this.colorInactive;
    serie.normal().fill(color);
    serie.selected().fill(color);
    serie.hovered().fill(color);
    serie.normal().stroke(color);
    serie.selected().stroke(color);
    serie.hovered().stroke(color);
    serie.zIndex(isEnabled ? 102 : 101);
    serie.tooltip(false);

    let serieLabel = serie.labels();
    serieLabel.enabled(true);
    serieLabel.fontFamily('Poppins');
    serieLabel.format('{%name}');
    serieLabel.fontColor('white');
    serieLabel.fontSize('24px');
    serieLabel.fontWeight(500);
    // serieLabel.zIndex(isEnabled ? 102 : 101);
  }

  setRedBorder(bubble: anychart.core.cartesian.series.Bubble) {
    bubble.normal().stroke('#FF2519', 3);
    bubble.selected().stroke('#FF2519', 3);
    bubble.hovered().stroke('#FF2519', 3);
  }
}
