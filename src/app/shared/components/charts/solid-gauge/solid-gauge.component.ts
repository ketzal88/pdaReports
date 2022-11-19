import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { disabledCredits } from '../../../utils/chart.util';

@Component({
  selector: 'app-solid-gauge',
  templateUrl: './solid-gauge.component.html',
  styleUrls: ['./solid-gauge.component.scss'],
})
export class SolidGaugeComponent implements OnInit, AfterViewInit {
  //Bindings
  private data: any;
  private _value: number;

  //Inputs
  @Input() set value(newValue: number) {
    this._value = newValue;
    if (this.gauge) {
      this.gauge.dispose();
      this.loadChart();
      this.showChart();
    }
  }

  @Input() title: string = 'Compatibilidad de puesto';

  names!: any;
  palette!: any;
  gauge!: any;

  //ViewChilds
  @ViewChild('chartContainer') container: any; //Esto viene del div

  constructor() {}

  //Cargamos la informacion
  ngOnInit(): void {
    this.loadChart();
  }

  //Aca mandamos a visualizar
  ngAfterViewInit(): void {
    this.showChart();
  }

  loadChart(): void {
    this.data = [this.value, 100];
    let dataSet = anychart.data.set(this.data);
    this.names = [this.title];

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

  showChart(): void {
    this.gauge.container(this.container.nativeElement);
    this.gauge.draw();
    disabledCredits(this.gauge);
  }

  makeBarWithBar(gauge: any, radius: any, i: any, data: any): void {
    var stroke = null;

    gauge
      .label(i)
      .width(250)
      .text(
        this.data[i] +
          '%<br> <span style="font-size:26;font-family:Poppins;">' +
          this.names[i] +
          '</span>'
      )
      .wordBreak('break-word')
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

  get value(): number {
    return this._value;
  }
}
