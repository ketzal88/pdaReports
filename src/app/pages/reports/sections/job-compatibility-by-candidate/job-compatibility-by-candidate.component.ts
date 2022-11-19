import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { JobCompatibilityDetailed } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { JobCategory } from '../../../../core/services/microservices/job/job.interface';
import { MultipleJobCompatibility } from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { TippyService } from 'src/app/core/services/tippy.service';
@Component({
  selector: 'app-job-compatibility-by-candidate',
  templateUrl: './job-compatibility-by-candidate.component.html',
  styleUrls: ['./job-compatibility-by-candidate.component.scss'],
})
export class JobCompatibilityByCandidateComponent implements OnInit {
  @Input() jobCompatibilityDetailed: JobCompatibilityDetailed;
  @Input() multipleJobCompatibility: MultipleJobCompatibility[];
  @Input() jobCategory: JobCategory;
  @Input() selectedIndividualId!: string;

  chart!: anychart.charts.CircularGauge;
  @ViewChild('chartContainer') container!: ElementRef;

  primaryColor = '#0075FF';
  secondaryColor = '#FF4B7E';
  backgorundColor = '#D5D7D9';
  lightBackgorundColor = '#F5F4F4';

  constructor(private tippyService: TippyService) {}

  ngOnInit(): void {
    let data = this.multipleJobCompatibility.map(x => ({
      value: x.compatibilityPercentage,
      label: x.jobTitle,
    }));
    let dataSet = anychart.data.set([100, ...data.map(x => x.value * 100)]);

    let selected =
      this.multipleJobCompatibility.findIndex(
        x => x.individualId === this.selectedIndividualId
      ) + 1;

    let makeBarWithBar = (
      gauge: anychart.charts.CircularGauge,
      radius: number,
      i: number,
      width: number
    ) => {
      let stroke = null;
      let color = i == selected ? this.primaryColor : this.backgorundColor;
      gauge
        .label(i)
        .text(data[i].label) // color: #7c868e
        .useHtml(true);
      gauge
        .label(i)
        .hAlign('center')
        .vAlign('middle')
        .anchor('left-center')
        .padding(0, 10)
        .height(width + '%')
        .offsetY(radius + '%')
        .offsetX(0);

      gauge
        .bar(i)
        .dataIndex(i)
        .radius(radius)
        .width(width)
        .fill(color)
        .stroke(stroke)
        .zIndex(5);

      gauge
        .marker(i + 200)
        .type('circle')
        .data([100])
        .fill(this.lightBackgorundColor)
        .stroke(stroke)
        .radius(radius + width / 2 + 0.5)
        .size(width / 2);

      gauge
        .bar(i + 100)
        .radius(radius)
        .width(width)
        .fill(this.lightBackgorundColor)
        .stroke(stroke)
        .data([100])
        .zIndex(4);

      gauge
        .marker(i)
        .type('circle')
        .dataIndex(i)
        .fill(color)
        .stroke(stroke)
        .radius(radius + width / 2 + 0.5)
        .size(width / 2);

      gauge
        .marker(i + 100)
        .type('circle')
        .data([0])
        .fill(color)
        .stroke(stroke)
        .radius(radius + width / 2 + 0.5)
        .size(width / 2);

      gauge.tooltip(false);

      return gauge.bar(i);
    };

    let gauge = anychart.gauges.circular();
    this.chart = gauge;
    gauge.data(dataSet);
    gauge
      .fill('#fff')
      .stroke(null)
      .padding(0)
      .margin(100)
      .startAngle(180)
      .sweepAngle(180);

    let axis = gauge.axis().radius(100).width(1).fill(null);
    axis.scale().maximum(100);
    axis.scale().minimum(0);
    axis.ticks({ interval: 1 }).minorTicks({ interval: 1 });
    axis.labels().enabled(false);
    axis.ticks().enabled(false);
    axis.minorTicks().enabled(false);

    for (let index = 1; index < data.length; index++) {
      let radius = (130 / data.length) * index + 50;
      let width = 85 / data.length;
      makeBarWithBar(gauge, radius, index, width);
    }

    let tooltip = this.tippyService.showTooltip('');
    let tooltipDataIndex = null;

    this.chart.listen('pointMouseOver', (x: any) => {
      let serie: anychart.core.gauge.pointers.Bar = x.series;
      let index = serie.dataIndex();
      if (index === 0) {
        return;
      }
      const name = data[index].label;
      const value = data[index].value * 100;
      tooltipDataIndex = index;
      tooltip.hide();
      const content =
        '<span class="tooltip-text-bold">' +
        name +
        '</br>' +
        value +
        '%</span>';
      tooltip = this.tippyService.showTooltip(content);
      tooltip.setProps({ followCursor: 'initial' });
      tooltip.show();

      if (serie.fill() !== this.backgorundColor) {
        return;
      }
      this.chart.bar(index).fill(this.secondaryColor);
      this.chart.marker(index).fill(this.secondaryColor);
      this.chart.marker(index + 100).fill(this.secondaryColor);
    });
    this.chart.listen('pointMouseOut', (x: any) => {
      let serie: anychart.core.gauge.pointers.Bar = x.series;
      let index = serie.dataIndex();
      if (index === 0) {
        return;
      }
      if (tooltipDataIndex === index) {
        tooltip.hide();
      }
      if (serie.fill() !== this.secondaryColor) {
        return;
      }
      this.chart.bar(index).fill(this.backgorundColor);
      this.chart.marker(index).fill(this.backgorundColor);
      this.chart.marker(index + 100).fill(this.backgorundColor);
    });
  }

  ngAfterViewInit(): void {
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
  }
}
