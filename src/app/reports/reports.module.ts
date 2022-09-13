/// <reference path="../../../node_modules/anychart/dist/index.d.ts"/>
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackgroundComponent } from './background/background.component';
import { RelevamientoComponent } from './hiring/relevamiento/relevamiento.component';
import { MatButtonModule } from '@angular/material/button';
import { CompatibilidadGrupoCandidatosComponent } from './charts/compatibilidad-grupo-candidatos/compatibilidad-grupo-candidatos.component';
import { GraficoComportamentalComponent } from './charts/grafico-comportamental/grafico-comportamental.component';
import { CompatibilidadPuestoComponent } from './charts/compatibilidad-puesto/compatibilidad-puesto.component';
import { RepnaComponent } from './charts/repna/repna.component';
import { SmallBarWithNotchComponent } from './charts/small-bar-with-notch/small-bar-with-notch.component'


@NgModule({
  declarations: [
    BackgroundComponent,
    RelevamientoComponent,
    CompatibilidadGrupoCandidatosComponent,
    GraficoComportamentalComponent,
    CompatibilidadPuestoComponent,
    RepnaComponent,
    SmallBarWithNotchComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
  ]
})
export class ReportsModule { }
