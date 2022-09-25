import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import 'anychart';
import { disabledCredits } from '../../../utils/chart.util';

@Component({
  selector: 'app-gauge-linear',
  templateUrl: './gauge-linear.component.html',
  styleUrls: ['./gauge-linear.component.scss'],
})
export class GaugeLinearComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() value: number;
  @Input() text: string;
  @Input() color: string;
  @Input() layout: string = 'horizontal';

  names!: any;
  data!: any;
  palette!: any;
  gauge!: any;

  //ViewChilds
  @ViewChild('chartContainer') container: any; //Esto viene del div

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'].previousValue) {
      this.value = changes['value'].currentValue;
      this.gauge.dispose();
      this.ngOnInit();
      this.ngAfterViewInit();
    }
  }

  ngOnInit(): void {
    let data = anychart.data.set([['AQI', this.value]]);

    // set the gauge type
    this.gauge = anychart.gauges.linear();

    // set the data for the gauge
    this.gauge.data(data);

    // set the layout
    this.gauge.layout(this.layout);

    // set labels
    this.gauge
      .label(0)
      .position('left-center')
      .anchor('left-center')
      .offsetY('-30px')
      .offsetX('0px')
      .fontFamily('Poppins')
      .fontColor('#555')
      .fontSize(14)
      .fontWeight(400)
      .text(this.text);

    this.gauge
      .label(1)
      .position('left-center')
      .anchor('left-center')
      .offsetY('30px')
      .offsetX(this.text)
      .fontColor('#777777')
      .fontColor('#777777')
      .fontSize(14)
      .text(this.value);

    this.gauge
      .label(2)
      .position('right-center')
      .anchor('right-center')
      .offsetY('30px')
      .offsetX('50px')
      .fontColor('#777777')
      .fontSize(12)
      .fontFamily('Poppins')
      .text(' ');

    // create a color scale
    let scaleBarColorScale = anychart.scales.ordinalColor().ranges([
      {
        from: 0,
        to: 19,
        color: ['#F2F3F3'],
      },
      {
        from: 20,
        to: 80,
        color: [this.color],
      },
      {
        from: 81,
        to: 100,
        color: ['#F2F3F3'],
      },
    ]);

    // create a Scale Bar
    let scaleBar = this.gauge.scaleBar(0);

    // set the width of the Scale Bar
    scaleBar.width('7.5%');

    // use the color scale (defined earlier) as the color scale of the Scale Bar
    scaleBar.colorScale(scaleBarColorScale);

    // add a marker pointer
    let marker = this.gauge.marker(0);

    // set the marker type and color
    marker.type('triangle-down');
    marker.color('white');
    marker.stroke('black');
    marker.width('8.5%');

    // set the zIndex of the marker
    marker.zIndex(10);
    marker.offset('-0.2%');

    // configure the scale
    let scale = this.gauge.scale();
    scale.minimum(0);
    scale.maximum(100);
    //scale.ticks().interval(100);
    scale.ticks(false);

    // configure the axis
    let axis = this.gauge.axis();
    axis.minorTicks(false);
    axis.ticks(false);
    axis.width('0%');
    axis.offset('0%');
    axis.orientation('bottom');
    axis.labels(false);

    // set paddings
    this.gauge.padding([0, 20]);
  }
  ngAfterViewInit(): void {
    this.gauge.container(this.container.nativeElement);
    this.gauge.draw();
    disabledCredits(this.gauge);
  }
}
