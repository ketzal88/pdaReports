import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

type Polygon = ReturnType<anychart.charts.Polar["polygon"]>;

@Component({
  selector: 'chart-grafico-comportamental',
  templateUrl: './grafico-comportamental.component.html',
  styleUrls: ['./grafico-comportamental.component.scss']
})
export class GraficoComportamentalComponent implements OnInit {

  constructor() { }
  @ViewChild('chartContainer') container!: ElementRef;

  @Input()
  get showPuesto(): boolean { return this._showPuesto; }
  set showPuesto(showPuesto: boolean) {
    this._showPuesto = showPuesto;
    if (this.puesto){
      this.puesto.enabled(showPuesto);
    }
  }
  private _showPuesto = true;
    @Input()
  get showLider(): boolean { return this._showLider; }
  set showLider(showLider: boolean) {
    this._showLider = showLider;
    if (this.lider){
      this.lider.enabled(showLider);
    }
  }
  private _showLider = false;
  @Input()
  get showEquipo(): boolean { return this._showEquipo; }
  set showEquipo(showEquipo: boolean) {
    this._showEquipo = showEquipo;    
    if (this.equipo){
      this.equipo.enabled(showEquipo);
    }
  }
  private _showEquipo = false;

  chart!: anychart.charts.Polar;
  persona!: Polygon;
  puesto!: Polygon;
  lider!: Polygon;
  equipo!: Polygon;

  ngOnInit(): void {
    let persona = this.generateData();
    let puesto = this.generateData();
    let lider = this.generateData();
    let equipo = this.generateData();

    let chart = anychart.polar();

    // set title settings
    chart
      .title()
      .enabled(false);

    // setup chart appearance settings
    chart
      .background("#00000000")
      .sortPointsByX(false)
      .xScale("ordinal")
      .yAxis(false);

    // format chart tooltip
    chart
      .tooltip(false);

    chart.interactivity(false);

    // set chart grid settings
    chart.yGrid(false);
    chart.xGrid(true);

    // set chart x-axis settings
    chart.xAxis().fill('#EDECEF').stroke('none').overlapMode('auto-width');

    // set chart x-axis ticks settings
    chart.xAxis().ticks().length(0).stroke('#FEFEFE');


    // set chart x-axis labels settings
    chart.xAxis().labels().padding(15).fontSize(12).fontOpacity(1).fontWeight(600);

    this.persona = this.createPolygon(persona, chart, "#d213f1")
    this.puesto = this.createPolygon(puesto, chart, "#007efd")
    this.lider = this.createPolygon(lider, chart, "#0be300")
    this.equipo = this.createPolygon(equipo, chart, "#FF0000")

    this.puesto.enabled(this.showPuesto);
    this.lider.enabled(this.showLider);
    this.equipo.enabled(this.showEquipo);

    // let puestoPoly = chart.polygon(puesto);
    // puestoPoly
    //   .name('Polygon')
    //   .color('#CD4A2D')
    //   .fill('rgba(180, 180, 180, 0.2)')
    //   .zIndex(31);

    // workaround to make even/odd xAxis labels coloring
    chart.listen('chartDraw', function () {
      let count = chart.xAxis().labels().getLabelsCount();
      for (let i = 0; i < count; i++) {
        let color = "#2e2e2e";
        switch (i) {
          case 2:
            color = "#deb709";
            break;
          case 6:
            color = "#0eb1f2";
            break;
          case 10:
            color = "#33b13e";
            break;
          case 14:
            color = "#fd752c";
            break;
        }
        let label = chart.xAxis().labels().getLabel(i);
        if (label) {
          label.fontColor(color);
          label.draw();
        }
      }
    });
    this.chart = chart;
  }

  ngAfterViewInit() {
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
  }

  generateData() {
    return [
      { x: "Iniciativa", value: Math.random() + 0.5 },
      { x: "Persuasión", value: Math.random() + 0.5 },
      { x: "Influencia", value: Math.random() + 0.5 },
      { x: "Autonomía", value: Math.random() + 0.5 },
      { x: "Asesoramiento", value: Math.random() + 0.5 },
      { x: "Servicio y soporte", value: Math.random() + 0.5 },
      { x: "Amabilidad", value: Math.random() + 0.5 },
      { x: "Paciencia", value: Math.random() + 0.5 },
      { x: "Precisión", value: Math.random() + 0.5 },
      { x: "Concentración", value: Math.random() + 0.5 },
      { x: "Análisis", value: Math.random() + 0.5 },
      { x: "Obediencia", value: Math.random() + 0.5 },
      { x: "Implementación", value: Math.random() + 0.5 },
      { x: "Dinamismo", value: Math.random() + 0.5 },
      { x: "Determinación", value: Math.random() + 0.5 },
      { x: "Expeditividad", value: Math.random() + 0.5 },
    ];
    // let i = 1;
    //     return [
    //   { x: "Iniciativa", value: (i++ * (5*7*9*13*17*24)) % 254},
    //   { x: "Persuasión", value: (i++ * (5*7*9*13*17*24)) % 254},
    //   { x: "Influencia", value: (i++ * (5*7*9*13*17*24)) % 254},
    //   { x: "Autonomía", value: (i++ * (5*7*9*13*17*24)) % 254},
    //   { x: "Asesoramiento", value: (i++ * (5*7*9*13*17*24)) % 254},
    //   { x: "Servicio y soporte", value: (i++ * (5*7*9*13*17*24)) % 254},
    //   { x: "Amabilidad", value: (i++ * (5*7*9*13*17*24)) % 254},
    //   { x: "Paciencia", value: (i++ * (5*7*9*13*17*24)) % 254},
    //   { x: "Precisión", value: (i++ * (5*7*9*13*17*24)) % 254},
    //   { x: "Concentración", value: (i++ * (5*7*9*13*17*24)) % 254},
    //   { x: "Análisis", value: (i++ * (5*7*9*13*17*24)) % 254},
    //   { x: "Obediencia", value: (i++ * (5*7*9*13*17*24)) % 254},
    //   { x: "Implementación", value: (i++ * (5*7*9*13*17*24)) % 254},
    //   { x: "Dinamismo", value: (i++ * (5*7*9*13*17*24)) % 254},
    //   { x: "Determinación", value: (i++ * (5*7*9*13*17*24)) % 254},
    //   { x: "Expeditividad", value: (i++ * (5*7*9*13*17*24)) % 254},
    // ];
    
  }

  createPolygon(data: ReturnType<GraficoComportamentalComponent["generateData"]>, chart: anychart.charts.Polar, color: string) {
    let polygon = chart.polygon(data);
    polygon
      .name('Polygon')
      .fill(color + "04")
      .stroke(color, 3)
      .zIndex(31);
    polygon.hovered().markers(false);
    polygon.selectionMode("none");
    return polygon;
  }

  togglePolygon(polygon: Polygon) {
    polygon.enabled(!polygon.enabled());
  }
}
