import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { HeaderModule } from '../shared/header/header.module';
import { SideBarModule } from '../shared/side-bar/side-bar.module';
import { StepsService } from '../core/services/steps.service';
import { ReportsModule } from './reports/reports.module';
import { CompetencyService } from '../core/services/microservices/competency/compentecy.service';
import { GroupingService } from '../core/services/microservices/individual/grouping.service';
import { AreaService } from '../core/services/microservices/individual/area.service';
import { ClientService } from '../core/services/microservices/client/client.service';
import { TranslateModule } from '@ngx-translate/core';
import { SectionsModule } from './reports/sections/sections.module';

@NgModule({
  declarations: [PagesComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    HeaderModule,
    SideBarModule,
    ReportsModule,
    TranslateModule,
    SectionsModule,
  ],
  exports: [],
  providers: [
    StepsService,
    // JobService,
    CompetencyService,
    GroupingService,
    AreaService,
    // GenderService,
    ClientService,
  ],
})
export class PagesModule {}
