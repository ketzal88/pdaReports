import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import 'anychart';
import { TippyService } from 'src/app/core/services/tippy.service';
import { TypeBehavioral, TypeBehavioralItem } from '../../behavioral-trend/interfaces/type-behavioral.interface';

@Component({
  selector: 'app-tendencia-comportamental-labeled',
  templateUrl: './tendencia-comportamental-labeled.component.html',
  styleUrls: ['./tendencia-comportamental-labeled.component.scss'],
})
export class TendenciaComportamentalLabeledComponent implements OnInit, AfterViewInit {
  constructor(private tippyService: TippyService) { }
  @ViewChild('chartContainer') container!: ElementRef;

  @Input() value: number = 100;
  @Input() color: string = '#F2F3F3';
  @Input() data: TypeBehavioral;

  gauge!: anychart.charts.LinearGauge;

  ngOnInit(): void {
    let value = this.value;
    let data = anychart.data.set([['AQI', value]]);
    let color = this.color;
    // set the gauge type
    this.gauge = anychart.gauges.linear();
    this.gauge.interactivity(false);

    // set the data for the gauge
    this.gauge.data(data);
    // this.height(24);

    // set the layout
    this.gauge.layout('horizontal');
    this.gauge.background('transparent');


    // create a color scale
    let scaleBarColorScale = anychart.scales.ordinalColor().ranges([
      {
        from: 0,
        to: value,
        color: [color],
      },
      {
        from: value + 1,
        to: 100,
        color: ['#F2F3F3'],
      },
    ]);

    // create a Scale Bar
    let scaleBar = this.gauge.scaleBar(0);

    // set the width of the Scale Bar
    scaleBar.width('75%');

    // use the color scale (defined earlier) as the color scale of the Scale Bar
    scaleBar.colorScale(scaleBarColorScale);

    // add a marker pointer
    let marker = this.gauge.marker(0);

    // set the marker type and color
    marker.type('circle');
    marker.color(color);
    marker.stroke('black', 0);
    marker.width('75%');
    marker.data([0]);
    // set the zIndex of the marker
    marker.zIndex(10);
    marker.offset('0%');

    // add a marker pointer
    marker = this.gauge.marker(0);

    // set the marker type and color
    marker.type('circle');
    marker.color(color);
    marker.stroke('black', 0);
    marker.width('75%');
    marker.data([value]);
    // set the zIndex of the marker
    marker.zIndex(10);
    marker.offset('0%');

    // add a marker pointer
    marker = this.gauge.marker(0);

    // set the marker type and color
    marker.type('circle');
    marker.color('#F2F3F3');
    marker.stroke('#00000000');
    marker.width('75%');
    marker.data([100]);
    // set the zIndex of the marker
    marker.zIndex(-10);

    // configure the scale
    let scale = this.gauge.scale();
    scale.minimum(0);
    scale.maximum(100);

    this.data?.data.forEach(x => {
      this.createMarker(x);
    });

    // set paddings
    this.gauge.padding([34, 15]);
  }

  ngAfterViewInit(): void {
    this.gauge.container(this.container.nativeElement);
    this.gauge.draw();
  }

  createMarker(item: TypeBehavioralItem): void {
    // add a marker pointer
    let marker = this.gauge.marker(0);

    // set the marker type and color
    marker.type('circle');
    if (item.selected) {
      marker.color('#007EFD');
      marker.stroke('white', 2);
    } else {
      marker.color('white');
    }
    marker.width('60%');
    marker.data([{ x: item.shortName, value: item.value, title: item.shortName }]);
    // set the zIndex of the marker
    marker.zIndex(100);
    marker.offset('7.5%');

    marker.labels(true);
    marker.labels()
      .vAlign("center")
      .hAlign("left")
      .offsetY("50%")
      .offsetX("1.5%")
      .format("{%title}")
      .fontFamily('Poppins')
      .fontColor('#000000')
      .fontWeight(400)
      .fontSize(19);

    let tooltip = null;
    const content =
      '<span class="tooltip-text-bold">' +
      item.shortName +
      '</br>' +
      item.value +
      '%</span>';
    marker.listen("pointMouseOver", () => {
      tooltip = this.tippyService.showTooltip(content);
      tooltip.setProps({ followCursor: 'initial' });
      tooltip.show();
    })
    marker.listen("pointMouseOut", () => {
      if (tooltip)
        tooltip.hide();
    })

  }
}
