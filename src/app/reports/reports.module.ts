import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackgroundComponent } from './background/background.component';
import { RelevamientoComponent } from './hiring/relevamiento/relevamiento.component';
import { MatButtonModule } from '@angular/material/button'


@NgModule({
  declarations: [
    BackgroundComponent,
    RelevamientoComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
  ]
})
export class ReportsModule { }
