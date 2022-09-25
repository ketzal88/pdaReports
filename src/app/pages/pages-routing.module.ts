import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./report-central/report-central.module').then(
        m => m.ReportCentralModule
      ),
  },
  {
    path: 'reports',
    // component: ReportsComponent,
    loadChildren: () =>
      import('./reports/reports.module').then(m => m.ReportsModule),
  },
  /*,
  {
    path: 'people-management',
    // component: PeopleManagementComponent,
    loadChildren: () =>
      import('./people-management/people-management.module').then(
        m => m.PeopleManagementModule
      ),
  },
*/
  // {
  //   path: '',
  //   redirectTo: '/app/people-management',
  // },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
