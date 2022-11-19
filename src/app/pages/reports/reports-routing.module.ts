import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateReviewComponent } from './candidate-review/candidate-review.component';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
  {
    path: 'candidate-review',
    component: CandidateReviewComponent,
  },
  {
    path: '',
    component: ReportsComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
