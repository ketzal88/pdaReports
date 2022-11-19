import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ThemeColors } from '../../../themes/blue';
import { JobCompatibilityFromGroup } from '../../../../../core/services/microservices/reports/interfaces/pdaGroupSectionsResponse.interface';
import {
  getDottedFirstCharacters,
  getIndividualShortName,
} from '../../../../../core/utils/strings.util';
import { TippyService } from 'src/app/core/services/tippy.service';

@Component({
  selector: 'app-chart-compatibilidad-grupo-candidatos',
  templateUrl: './compatibilidad-grupo-candidatos.component.html',
  styleUrls: ['./compatibilidad-grupo-candidatos.component.scss'],
})
export class CompatibilidadGrupoCandidatosComponent
  implements OnInit, AfterViewInit
{
  constructor(private tippyService: TippyService) {}
  @ViewChild('chartContainer') container!: ElementRef;

  @Input() data!: JobCompatibilityFromGroup[];
  @Input() selectedIndividualId: string;
  @Input() jobTitle: string = '';

  chart!: anychart.charts.Polar;

  ngOnInit(): void {
    this.chart = anychart.polar();
    const formattedData = this.data.map(x => {
      return {
        x: x.individualId,
        name: getIndividualShortName(x.individualName),
        value: x.compatibilityPercentage * 100,
        fill:
          x.individualId !== this.selectedIndividualId
            ? '#cccccc88'
            : ThemeColors.colorPrimary,
        stroke: '#cccccc88',
        hovered:
          x.individualId === this.selectedIndividualId
            ? undefined
            : {
                fill: '#ff4b7e',
                stroke: '#ff3b6e',
              },
      };
    });

    this.jobTitle = this.data.filter(
      x => x.individualId === this.selectedIndividualId
    )[0].jobTitle;

    let columnSeries = this.chart
      .column(formattedData)
      .tooltip(false)
      .selectionMode('none');
    columnSeries
      .labels()
      .format('{%value}%')
      .enabled(false)
      .fontColor('#ddddd')
      .fontSize('100%');
    columnSeries.hovered().labels().fontColor('#FFFFF');

    // set title settings
    this.chart.title().enabled(false);

    // disable y-axis
    this.chart.yAxis(false);
    this.chart.xAxis().stroke('#00000000');

    // set chart x-axis ticks settings
    this.chart.xAxis().ticks().length(30);
    this.chart.xAxis().ticks().stroke('grey', 1, '2 2');
    this.chart
      .xAxis()
      .labels()
      .format(function () {
        return formattedData.find(x => x.x === this.tickValue)?.name;
      });

      this.chart.yGrid().enabled(true).stroke({
        keys: ['0.1 #0075FF', '0.6 #0075FF', '0.61 #00000000'],
        cx: 0.5,
        cy: 0.5,
        fx: .5,
        fy: .5,
      }, 4);
      
      // this.chart.yGrid(0).enabled(true).stroke("#FF0000", 4);

    this.chart
      .xAxis()
      .labels()
      .fontSize(12)
      .fontOpacity(1)
      .fontColor('black')
      .fontWeight(600)
      .hAlign('right');

    this.chart.xGrid().stroke('grey', 1, '2 2');

    // set x-scale
    this.chart.xScale('ordinal');
    this.chart.innerRadius('50%');
    this.chart.background().fill('red', 0);
    let chart = this.chart;

    this.chart.listen('chartDraw', function () {
      let count = chart.xAxis().labels().getLabelsCount();
      for (let i = count / 4; i < (count * 3) / 4; i++) {
        let label = chart.xAxis().labels().getLabel(i);
        if (label) {
          label.hAlign('left');
          label.draw();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
    let tooltip = this.tippyService.showTooltip('');
    let tooltipDataIndex = null;
    this.chart.listen('pointMouseOver', (x: any) => {
      tooltipDataIndex = x.point.index;
      if (tooltip)
      tooltip.hide();
      const point = x['point'];
      const individualId = point.get('x');
      const name = this.data.find(
        x => x.individualId === individualId
      ).individualName;
      const value = point.get('value');
      const content =
        '<span class="tooltip-text-bold">' +
        name +
        '</br>' +
        value +
        '%</span>';
      tooltip = this.tippyService.showTooltip(content);
      tooltip.setProps({ followCursor: 'initial' });
      tooltip.show();
    });
    this.chart.listen('pointMouseOut', (x: any) => {
      if (tooltipDataIndex === x.point.index) {
        tooltip.hide();
      }
    });
  }

  getDottedFirstCharacters = getDottedFirstCharacters;
}
