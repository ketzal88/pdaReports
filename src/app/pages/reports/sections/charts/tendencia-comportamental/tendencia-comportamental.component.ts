import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import 'anychart';

@Component({
  selector: 'chart-tendencia-comportamental',
  templateUrl: './tendencia-comportamental.component.html',
  styleUrls: ['./tendencia-comportamental.component.scss']
})
export class TendenciaComportamentalComponent implements OnInit {

  constructor() { 
  }
  @ViewChild('chartContainer') container!: ElementRef;

  @Input() markers: number[] = [];
  @Input() color: string = "#ff6819";

  gauge!: anychart.charts.LinearGauge;

  ngOnInit(): void {
    let value = 100;
    let data = anychart.data.set([['AQI', value]]);
    let color = this.color;
    // set the gauge type
    this.gauge = anychart.gauges.linear();
    this.gauge.interactivity(false);

    // set the data for the gauge
    this.gauge.data(data);

    // set the layout
    this.gauge.layout("horizontal");
    this.gauge.background("transparent");

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
    marker.color("#F2F3F3");
    marker.stroke("#00000000");
    marker.width('75%');
    marker.data([100]);
    // set the zIndex of the marker
    marker.zIndex(-10);

    // configure the scale
    let scale = this.gauge.scale();
    scale.minimum(0);
    scale.maximum(100);

    this.markers.forEach(value => {
      this.createMarker("IS", value);
    });

    // set paddings
    this.gauge.padding([0, 15]);
  }

  ngAfterViewInit() {
    this.gauge.container(this.container.nativeElement);
    this.gauge.draw();
  }

  createMarker(title: string, value: number) {
    // add a marker pointer
    let marker = this.gauge.marker(0);

    // set the marker type and color
    marker.type('circle');
    marker.color("#007EFD");
    marker.stroke("white", 2)
    marker.width('6%');
    marker.data([{ x: title, value: value, title: title }]);
    // set the zIndex of the marker
    marker.zIndex(100);
    marker.offset('0.75%');

    marker.labels(true);
    marker.labels()
      .vAlign("center")
      .hAlign("left")
      .offsetY("7%")
      .offsetX("-3%")
      .format("{%title}")
  }
}
