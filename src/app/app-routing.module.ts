import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RelevamientoComponent } from './reports/hiring/relevamiento/relevamiento.component';
import { RoutenavComponent } from './routenav/routenav.component';


const routes: Routes = [
  { path: 'reportes/hiring/relevamiento', component: RelevamientoComponent },
  { path: '', component: RoutenavComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
