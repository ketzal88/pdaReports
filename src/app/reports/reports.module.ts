/// <reference path="../../../node_modules/anychart/dist/index.d.ts"/>
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackgroundComponent } from './background/background.component';
import { RelevamientoComponent } from './hiring/relevamiento/relevamiento.component';
import { MatButtonModule } from '@angular/material/button';
import { CompatibilidadGrupoCandidatosComponent } from './charts/compatibilidad-grupo-candidatos/compatibilidad-grupo-candidatos.component'


@NgModule({
  declarations: [
    BackgroundComponent,
    RelevamientoComponent,
    CompatibilidadGrupoCandidatosComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
  ]
})
export class ReportsModule { }
