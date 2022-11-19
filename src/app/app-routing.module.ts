import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { AuthEnableGuard } from './core/guards/auth-enable.guard';
import { NopageComponent } from './unauthorized/noPage/nopage.component';
import { LoginComponent } from './unauthorized/login/login.component';
import { AuthEnableAnonymousGuard } from './core/guards/auth-enable-anonymous';
import { ReportsModule } from './pages/reports/reports.module';
import { ReportsComponent } from './pages/reports/reports.component';
import { NotAllowedComponent } from './unauthorized/not-allowed/not-allowed.component';
import { PasswordRecoveryComponent } from './unauthorized/login/password-recovery/password-recovery.component';
import { CandidateReviewComponent } from './pages/reports/candidate-review/candidate-review.component';

const routes: Routes = [
  { path: '', redirectTo: '/app', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'passwordRecovery',
    component: PasswordRecoveryComponent,
  },
  {
    path: 'app/reports/candidate-review',
    component: CandidateReviewComponent,
  },
  {
    path: 'app/reports/:id',
    canActivate: [AuthEnableAnonymousGuard],
    loadChildren: () =>
      import('./pages/reports/reports.module').then(m => m.ReportsModule),
  },
  {
    path: 'app',
    component: PagesComponent,
    //Guard enable valid token
    canActivate: [AuthEnableGuard],
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
  },
  {
    path: 'nopage',
    component: NopageComponent,
  },
  {
    path: 'notAllowed',
    component: NotAllowedComponent,
  },
  {
    path: '**',
    component: NopageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
