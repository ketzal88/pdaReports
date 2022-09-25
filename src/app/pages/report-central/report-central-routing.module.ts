import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ReportCentralComponent } from './report-central.component';

const routes: Routes = [
  {
    path: '',
    component: ReportCentralComponent,
  },
  {
    path: 'configuration',
    // component: ConfigurationComponent,
    loadChildren: () =>
      import('./configuration/configuration.module').then(
        m => m.ConfigurationModule
      ),
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportCentralRoutingModule {}
