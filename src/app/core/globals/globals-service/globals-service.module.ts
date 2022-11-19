import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsService } from '../../services/microservices/reports/reports.service';
import { GeneratedReportsService } from '../../services/microservices/reports/generated-reports.service';
import { JobService } from '../../services/microservices/job/job.service';
import { IndividualFilterService } from '../../services/individual/individual-filter.service';
import { GenderService } from '../../services/microservices/individual/gender.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    ReportsService,
    GeneratedReportsService,
    JobService,
    IndividualFilterService,
    GenderService,
  ],
})
export class GlobalsServiceModule {}
