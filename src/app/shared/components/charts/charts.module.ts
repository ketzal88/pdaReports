import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart/chart.component';
import { SolidGaugeComponent } from './solid-gauge/solid-gauge.component';
import { ColumnPolarComponent } from './column-polar/column-polar.component';
import { CircledGaugeComponent } from './circled-gauge/circled-gauge.component';
import { PolylinePolarChartComponent } from './polyline-polar-chart/polyline-polar-chart.component';
import { PercentStackedColumnChartComponent } from './percent-stacked-column-chart/percent-stacked-column-chart.component';
import { BubbleChartComponent } from './bubble-chart/bubble-chart.component';
import { QuadrantChartComponent } from './quadrant-chart/quadrant-chart.component';
import { VennDiagramComponent } from './venn-diagram/venn-diagram.component';
import { StackedPolygonPolarComponent } from './stacked-polygon-polar/stacked-polygon-polar.component';
import { GaugeLinearComponent } from './gauge-linear/gauge-linear.component';
import { TableComponent } from './table/table.component';

@NgModule({
  declarations: [
    ChartComponent,
    SolidGaugeComponent,
    ColumnPolarComponent,
    CircledGaugeComponent,
    PolylinePolarChartComponent,
    PercentStackedColumnChartComponent,
    BubbleChartComponent,
    QuadrantChartComponent,
    VennDiagramComponent,
    StackedPolygonPolarComponent,
    GaugeLinearComponent,
    TableComponent,
  ],
  imports: [CommonModule],
  exports: [
    ChartComponent,
    SolidGaugeComponent,
    ColumnPolarComponent,
    CircledGaugeComponent,
    PolylinePolarChartComponent,
    PercentStackedColumnChartComponent,
    BubbleChartComponent,
    QuadrantChartComponent,
    VennDiagramComponent,
    StackedPolygonPolarComponent,
    GaugeLinearComponent,
    TableComponent,
  ],
})
export class ChartsModule {}
