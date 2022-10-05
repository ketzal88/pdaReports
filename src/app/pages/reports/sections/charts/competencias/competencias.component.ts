import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {ThemeColors} from '../../../themes/blue';

@Component({
  selector: 'chart-competencias',
  templateUrl: './competencias.component.html',
  styleUrls: ['./competencias.component.scss']
})
export class CompetenciasComponent implements OnInit {

  constructor() { }
  @ViewChild('chartContainer') container!: ElementRef;
  @Input() value: number = 0;
  @Input() color: string = ThemeColors.colorPrimary;
  @Input() tooltip: string = "";
  gauge!: anychart.charts.LinearGauge;

  ngOnInit(): void {
    let value = this.value;
    let data = anychart.data.set([['AQI', value]]);
    let color = this.color;
    // set the gauge type
    this.gauge = anychart.gauges.linear();

    // set the data for the gauge
    this.gauge.data(data);

    // set the layout
    this.gauge.layout("horizontal");
    this.gauge.background("transparent");

    if (this.tooltip && this.tooltip !== ""){
      this.gauge.tooltip().enabled(true).format(this.tooltip);
    }


    // create a color scale
    let scaleBarColorScale = anychart.scales.ordinalColor().ranges([
      {
        from: 0,
        to: value,
        color: [color],
      },
      {
        from: value,
        to: 100,
        color: ['#F2F3F3'],
      },
    ]);

    // create a Scale Bar
    let scaleBar = this.gauge.scaleBar(0);

    // set the width of the Scale Bar
    scaleBar.width('100%');

    // use the color scale (defined earlier) as the color scale of the Scale Bar
    scaleBar.colorScale(scaleBarColorScale);
    
    // add a marker pointer
    let marker = this.gauge.marker(0);

    // set the marker type and color
    marker.type('circle');
    marker.color(color);
    marker.stroke('black', 0);
    marker.width('100%');
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
    marker.width('100%');
    marker.data([value]);
    // set the zIndex of the marker
    marker.zIndex(10);
    marker.offset('0%');
    
    // add a marker pointer
    marker = this.gauge.marker(0);

    // set the marker type and color
    marker.type('circle');
    marker.color("#F2F3F3");
    marker.stroke("#00000000")
    marker.width('100%');
    marker.data([100]);
    // set the zIndex of the marker
    marker.zIndex(-10);

    // configure the scale
    let scale = this.gauge.scale();
    scale.minimum(0);
    scale.maximum(100);
    // set paddings
    this.gauge.padding([0, 40]);
  }

  ngAfterViewInit() {
    this.gauge.container(this.container.nativeElement);
    this.gauge.draw();
  }
}
