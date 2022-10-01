import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import 'anychart';
import { REPNA } from 'src/app/core/models/repna.model';
import { disabledCredits } from '../../../utils/chart.util';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss'],
})
export class BubbleChartComponent implements OnInit, OnChanges, AfterViewInit {
  private opacityActive: number = 1;
  private opacitInactive: number = 0.2;
  private colorInactive: string = '#757575 0.3';
  private colorR: string = '#ff6819 1';
  private colorE: string = '#FFD100 1';
  private colorP: string = '#27ACF7 1';
  private colorN: string = '#2FB039 1';
  private colorA: string = '#8C24D2 1';

  @Input() naturalREPNA: REPNA;
  @Input() roleREPNA: REPNA;
  @Input() naturalSelected: boolean;

  chart!: any;
  names!: any;
  series!: any;

  @ViewChild('chartContainer') container: any; //Esto viene del div

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
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
    this.chart.xAxis(0, { ticks: false, labels: false, stroke: '#ffffff' });
    this.chart.yAxis(0, { ticks: false, labels: false, stroke: '#ffffff' });

    //UNSELECTED CHART
    if (this.naturalSelected) {
      this.drawNaturalSeries();
    } else {
      this.drawRoleSeries();
    }

    //SPACER
    this.drawResizingSeries();
    this.drawMediaSeries();

    //Media Line

    //SELECTED CHART
    if (!this.naturalSelected) {
      this.drawNaturalSeries();
    } else {
      this.drawRoleSeries();
    }

    this.chart.maxBubbleSize('9%');
  }

  ngAfterViewInit(): void {
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
    disabledCredits(this.chart);
  }

  drawNaturalSeries(): void {
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
      .stroke(
        '#88868b',
        this.naturalSelected ? this.opacityActive : this.opacitInactive
      );

    let serieNaturalR = this.chart.bubble(naturalR);
    this.setLabelFormatAndBubbleStyle(
      serieNaturalR,
      this.colorR,
      this.naturalSelected
    );
    serieNaturalR.zIndex(100);

    let serieNaturalE = this.chart.bubble(naturalE);
    this.setLabelFormatAndBubbleStyle(
      serieNaturalE,
      this.colorE,
      this.naturalSelected
    );
    serieNaturalE.zIndex(100);

    let serieNaturalP = this.chart.bubble(naturalP);
    this.setLabelFormatAndBubbleStyle(
      serieNaturalP,
      this.colorP,
      this.naturalSelected
    );
    serieNaturalP.zIndex(100);

    let serieNaturalN = this.chart.bubble(naturalN);
    this.setLabelFormatAndBubbleStyle(
      serieNaturalN,
      this.colorN,
      this.naturalSelected
    );
    serieNaturalN.zIndex(100);

    let serieNaturalA = this.chart.bubble(naturalA);
    this.setLabelFormatAndBubbleStyle(
      serieNaturalA,
      this.colorA,
      this.naturalSelected
    );
  }
  drawRoleSeries(): void {
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
      .stroke(
        '#88868b',
        !this.naturalSelected ? this.opacityActive : this.opacitInactive
      );

    let serieRoleR = this.chart.bubble(roleR);
    this.setLabelFormatAndBubbleStyle(
      serieRoleR,
      this.colorR,
      !this.naturalSelected
    );
    serieRoleR.zIndex(100);

    let serieRoleE = this.chart.bubble(roleE);
    this.setLabelFormatAndBubbleStyle(
      serieRoleE,
      this.colorE,
      !this.naturalSelected
    );
    serieRoleE.zIndex(100);

    let serieRoleP = this.chart.bubble(roleP);
    this.setLabelFormatAndBubbleStyle(
      serieRoleP,
      this.colorP,
      !this.naturalSelected
    );
    serieRoleP.zIndex(100);

    let serieRoleN = this.chart.bubble(roleN);
    this.setLabelFormatAndBubbleStyle(
      serieRoleN,
      this.colorN,
      !this.naturalSelected
    );
    serieRoleN.zIndex(100);

    let serieRoleA = this.chart.bubble(roleA);
    this.setLabelFormatAndBubbleStyle(
      serieRoleA,
      this.colorA,
      !this.naturalSelected
    );
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
    serie: any,
    color: string,
    isEnabled: boolean
  ): void {
    color = isEnabled ? color : this.colorInactive;
    serie.normal().fill(color);
    serie.selected().fill(color);
    serie.normal().stroke(color);
    serie.selected().stroke(color);

    let tooltip = serie.tooltip();
    tooltip.enabled(isEnabled);
    tooltip.title(false);
    tooltip.separator(false);

    tooltip.format(function (e: any) {
      return e.getData('name') + ' : ' + e.getData('value');
    });

    let serieLabel = serie.labels();
    serieLabel.enabled(isEnabled);
    serieLabel.format('{%name}');
    serieLabel.fontColor('white');
    serieLabel.fontSize('16px');
    serieLabel.fontWeight(600);
  }
}
