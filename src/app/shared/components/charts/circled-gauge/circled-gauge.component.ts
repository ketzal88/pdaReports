import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { disabledCredits } from '../../../utils/chart.util';

@Component({
  selector: 'app-circled-gauge',
  templateUrl: './circled-gauge.component.html',
  styleUrls: ['./circled-gauge.component.scss'],
})
export class CircledGaugeComponent implements OnInit, AfterViewInit {
  names!: any;
  data!: any;
  palette!: any;
  gauge!: any;

  //ViewChilds
  @ViewChild('chartContainer') container: any; //Esto viene del div

  constructor() {}

  ngOnInit(): void {
    this.data = [72, 100];
    let dataSet = anychart.data.set(this.data);
    this.names = ['Compatibilidad de Puesto '];

    this.gauge = anychart.gauges.circular();
    this.gauge.data(dataSet);
    this.gauge
      .fill('#fff')
      .stroke(null)
      .padding(0)
      .margin(0)
      .startAngle(0)
      .sweepAngle(360);

    //let axis = this.gauge.axis().radius(100).width(1).fill(null);
    let axis = this.gauge.axis().radius(130).width(1).fill('#f1f1f1');
    axis.scale().minimum(0);
    axis.scale().maximum(100);
    axis.scale().ticks({ interval: 1 });
    axis.scale().minorTicks({ interval: 1 });
    axis
      .scale()
      .minimum(0)
      .maximum(100)
      .ticks({ interval: 1 })
      .minorTicks({ interval: 1 });
    axis.labels().enabled(false);
    axis.ticks().enabled(false);
    axis.minorTicks().enabled(false);
    this.makeBarWithBar(this.gauge, 100, 0, 17);
  }
  ngAfterViewInit(): void {
    this.gauge.container(this.container.nativeElement);
    this.gauge.draw();
    disabledCredits(this.gauge);
  }

  makeBarWithBar(gauge: any, radius: any, i: any, data: any): void {
    var stroke = null;

    gauge
      .label(i)
      .text(
        this.data[i] +
          '%<br> <span style="font-size:24;font-family:Poppins;">' +
          this.names[i] +
          '</span>'
      )
      .useHtml(true);
    gauge
      .label(i)
      .useHtml(true)
      .hAlign('center')
      .vAlign('middle')
      .anchor('center')
      .fontColor('#000')
      .fontSize(40)
      .fontWeight(800)
      .offsetX(0);

    gauge
      .bar(i)
      .dataIndex(i)
      .radius(radius)
      .width(20)
      .stroke(null)
      .fill('#007efd')
      .zIndex(5);
    gauge
      .bar(1)
      .dataIndex(1)
      .radius(radius)
      .width(20)
      .fill('#f2f3f3')
      .stroke(stroke)
      .zIndex(4);

    return gauge.bar(i);
  }
}
