import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TippyService } from 'src/app/core/services/tippy.service';
import { ThemeColors } from '../../../themes/blue';

@Component({
  selector: 'app-chart-compatibilidad-puesto',
  templateUrl: './compatibilidad-puesto.component.html',
  styleUrls: ['./compatibilidad-puesto.component.scss'],
})
export class CompatibilidadPuestoComponent implements OnInit, AfterViewInit {
  @ViewChild('chartContainer') container!: ElementRef;
  private _value: number;
  //Inputs
  @Input() set value(newValue: number) {
    this._value = newValue;
    if (this.chart) {
      this.chart.dispose();
      this.loadChart();
      this.showChart();
    }
  }

  constructor(
    private translateService: TranslateService,
    private tippyService: TippyService
  ) {}

  chart!: anychart.charts.Pie;

  loadChart(): void {
    let data = anychart.data.set([
      // { value: 2.5, stroke: { thickness: 0 } },
      {
        value: 100 - this._value,
        stroke: {
          color: '#F4F4F4',
          thickness: '25%',
          lineJoin: 'round',
          lineCap: 'round',
        },
        normal: {
          zIndex: -8,
        },
      },
      // { value: 2.5, stroke: { thickness: 0 } },
      {
        value: this._value,
        stroke: {
          angle: 45,
          lineJoin: 'round',
          lineCap: 'round',
          mode: true,
          opacity: 1,
          thickness: '25%',
          keys: [
            { color: ThemeColors.colorPrimary, offset: 0, opacity: 1 },
            { color: '#40c4ff', offset: 0.8, opacity: 1 },
          ],
        },
        normal: {
          zIndex: 4,
        },
        zIndex: 5,
      },
    ]);
    // create pie chart with passed data
    let chart = anychart.pie(data);
    this.chart = chart;

    // set chart radius
    chart.innerRadius('100%').legend(false).interactivity(false);

    chart.background('#ff000000');

    // create standalone label and set settings
    let porc = anychart.standalones.label();
    porc
      .enabled(true)
      .text(this._value + '%')
      .width('100%')
      .height('100%')
      .adjustFontSize(true, true)
      .minFontSize(10)
      .maxFontSize(80)
      .fontColor('black')
      .fontWeight(700)
      .position('center')
      .anchor('center')
      .hAlign('center')
      .vAlign('bottom');

    let label = anychart.standalones.label();
    label
      .enabled(true)
      .text(
        this.translateService.instant(
          'REPORTS.SECTIONS.JOB_COMPATIBILITY_SECTION.TITLE'
        )
      )
      .width('100%')
      .height('100%')
      .adjustFontSize(true, true)
      .minFontSize(10)
      .maxFontSize(50)
      .fontColor('black')
      .fontWeight(700)
      .position('center')
      .anchor('center')
      .hAlign('center')
      .vAlign('top');

    let tab = anychart.standalones.table(2, 1);
    tab.border('black', 0);
    tab.cellBorder('black', 0);
    tab.getCell(0, 0).content(porc);
    tab.getCell(1, 0).content(label);
    tab.cellFill('#00000000');

    // set label to center content of chart
    chart.center().content(tab);
  }

  showChart(): void {
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
  }

  ngOnInit(): void {
    this.loadChart();
  }

  ngAfterViewInit(): void {
    this.showChart();
    this.tippyService.setTooltipOnElement(
      this.container.nativeElement,
      'Es la capacidad para identificar relaciones entre situaciones que no están explícitamente interrelacionadas, a través de un razonamiento creativo o conceptual.'
    );
  }
}
