import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceEdadGeneroComponent } from './balance-edad-genero/balance-edad-genero.component';
import { CompatibilidadGrupoCandidatosComponent } from './compatibilidad-grupo-candidatos/compatibilidad-grupo-candidatos.component';
import { CompatibilidadPuestoComponent } from './compatibilidad-puesto/compatibilidad-puesto.component';
import { CompatibilidadPuestosCandidatoComponent } from './compatibilidad-puestos-candidato/compatibilidad-puestos-candidato.component';
import { CompetenciasComponent } from './competencias/competencias.component';
import { ConsistenciaComponent } from './consistencia/consistencia.component';
import { GraficoComportamentalComponent } from './grafico-comportamental/grafico-comportamental.component';
import { RepnaComponent } from './repna/repna.component';
import { SmallBarWithNotchComponent } from './small-bar-with-notch/small-bar-with-notch.component';
import { TendenciaComportamentalComponent } from './tendencia-comportamental/tendencia-comportamental.component';

@NgModule({
  declarations: [
    CompatibilidadGrupoCandidatosComponent,
    GraficoComportamentalComponent,
    CompatibilidadPuestoComponent,
    RepnaComponent,
    SmallBarWithNotchComponent,
    CompetenciasComponent,
    BalanceEdadGeneroComponent,
    TendenciaComportamentalComponent,
    CompatibilidadPuestosCandidatoComponent,
    ConsistenciaComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class ChartsModule { }
