import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import 'anychart';
import { TypeBehavioral } from '../../behavioral-trend/interfaces/type-behavioral.interface';
@Component({
  selector: 'app-chart-tendencia-comportamental',
  templateUrl: './tendencia-comportamental.component.html',
  styleUrls: ['./tendencia-comportamental.component.scss'],
})
export class TendenciaComportamentalComponent implements OnInit, AfterViewInit {
  constructor() {}
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
    // set paddings
    this.gauge.padding([0, 15]);
  }

  ngAfterViewInit(): void {
    this.gauge.container(this.container.nativeElement);
    this.gauge.draw();
  }

  createMarker(title: string, value: number, selected: boolean): void {
    // add a marker pointer
    let marker = this.gauge.marker(0);

    // set the marker type and color
    marker.type('circle');
    if (selected) {
      marker.color('#007EFD');
      marker.stroke('white', 2);
    } else {
      marker.color('white');
    }
    marker.width('60%');
    marker.data([{ x: title, value: value, title: title }]);
    // set the zIndex of the marker
    marker.zIndex(100);
    marker.offset('7.5%');

    // marker.labels(true);
    // marker.labels()
    //   .vAlign("center")
    //   .hAlign("left")
    //   .offsetY("60%")
    //   .offsetX("-3%")
    //   .format("{%title}")
  }
}
