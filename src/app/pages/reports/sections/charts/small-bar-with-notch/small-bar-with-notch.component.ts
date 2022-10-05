import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
@Component({
  selector: 'chart-small-bar-with-notch',
  templateUrl: './small-bar-with-notch.component.html',
  styleUrls: ['./small-bar-with-notch.component.scss']
})
export class SmallBarWithNotchComponent implements OnInit {

  constructor() { }
  @ViewChild('chartContainer') container!: ElementRef;
  @Input() value: number =  32;
  @Input() text: string = "Energía";
  @Input() color: string = "#007EFD";
  @Input() layout: string = 'horizontal';

  gauge!: anychart.charts.LinearGauge;


  ngOnInit(): void {
    let value = 50;
    let data = anychart.data.set([['AQI', value]]);
    let title = this.text;
    let color = this.color;
    // set the gauge type
    this.gauge = anychart.gauges.linear();
    this.gauge.interactivity(false);

    // set the data for the gauge
    this.gauge.data(data);

    // set the layout
    this.gauge.layout(this.layout);
    this.gauge.background("transparent");

    // set labels
    this.gauge
      .label(0)
      .position('left-center')
      .anchor('left-center')
      .offsetY('-30px')
      .offsetX('30px')
      .fontFamily('Poppins')
      .fontColor('#1F140F')
      .fontSize(12)
      .fontWeight(700)
      .text(title)
      .useHtml(true);

      let valueOffset = value / 100 * 70 + 13;
      valueOffset = Math.min(valueOffset,100);
      valueOffset = Math.max(valueOffset,0);
    this.gauge
      .label(1)
      .position('left-center')
      .anchor('left-center')
      .offsetY('15px')
      .offsetX(valueOffset.toString() + '%')
      .fontFamily('Poppins')
      .fontColor('#1F140F')
      .fontWeight(600)
      .fontSize(10)
      .text(value.toString() + "%")
      .useHtml(true);

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
        color: [color],
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
    marker.type('line');
    marker.color('white');
    marker.stroke('black');
    marker.width('7.5%');
    marker.data([value]);
    // set the zIndex of the marker
    marker.zIndex(30);
    // marker.height("20px");

    
    // add a marker pointer
    marker = this.gauge.marker(0);

    // set the marker type and color
    marker.type('circle');
    marker.color(color);
    marker.stroke('black', 0);
    marker.width('7.5%');
    marker.data([20]);
    // set the zIndex of the marker
    marker.zIndex(10);
    marker.offset('0%');

    
    // add a marker pointer
    marker = this.gauge.marker(0);

    // set the marker type and color
    marker.type('circle');
    marker.color(color);
    marker.stroke('black', 0);
    marker.width('7.5%');
    marker.data([80]);
    // set the zIndex of the marker
    marker.zIndex(10);
    marker.offset('0%');

    
    // add a marker pointer
    marker = this.gauge.marker(0);

    // set the marker type and color
    marker.type('circle');
    marker.color("#F2F3F3");
    marker.stroke('#cecece');
    marker.width('7.3%');
    marker.data([0]);
    // set the zIndex of the marker
    marker.zIndex(-10);
    marker.offset('0.05%');
    
    // add a marker pointer
    marker = this.gauge.marker(0);

    // set the marker type and color
    marker.type('circle');
    marker.color("#F2F3F3");
    marker.stroke('#cecece');
    marker.width('7.3%');
    marker.data([100]);
    // set the zIndex of the marker
    marker.zIndex(-10);
    marker.offset('0.05%');
    
    

    // configure the scale
    let scale = this.gauge.scale();
    scale.minimum(0);
    scale.maximum(100);
    //scale.ticks().interval(100);
    // scale.ticks(false);

    // configure the axis
    let axis = this.gauge.axis();
    axis.minorTicks(false);
    axis.ticks(false);
    axis.width('0%');
    axis.offset('0%');
    axis.orientation('bottom');
    axis.labels(false);
    axis.zIndex(11);

    // set paddings
    this.gauge.padding([0, 40]);
  let drawer = function (this: anychart.core.series.RenderingSettings.Context | any) {
    // if missing (not correct data), then skipping this point drawing
    if (this.missing) {
      return;
    }
    // get shapes group
    let path = (this.shapes || this.getShapesGroup(this.pointState)).path as anychart.graphics.vector.Path;
    // calculate the left value of the x-axis
    let leftX = this.x - this.pointWidth / 2;
    // calculate the right value of the x-axis
    let rightX = leftX + this.pointWidth;
    // calculate the half of point width
    let rx = this.pointWidth / 2;

    if (this.zero - this.value - rx < -4) {
      path
        // resets all 'line' operations
        .clear();
        return;
    }
    path
      // resets all 'line' operations
      .clear()
      // draw column with rounded edges
      .moveTo(leftX, this.zero - rx) //esq izq
      .lineTo(leftX, this.value + rx)
      .circularArc(leftX + rx, this.value + rx, rx, rx, 180, 180)
      .lineTo(rightX, this.zero - rx)
      .circularArc(leftX + rx, this.zero - rx, rx, rx, 0, 180)
      // .lineTo(rightX, this.zero)
      // close by connecting the last point with the first straight line
      .close();
  }
  
  // let shapes = series.rendering().shapes();
  // series.rendering()
  //   // set point function to drawing
  //   .point(drawer)
  //   // set update point function to drawing, change the point shape when the state changes
  //   .updatePoint(drawer)
  //   // set shapes
  //   .shapes(shapes);
  }

  ngAfterViewInit() {
    this.gauge.container(this.container.nativeElement);
    this.gauge.draw();
  }

}
