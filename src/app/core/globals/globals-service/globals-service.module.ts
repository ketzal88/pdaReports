import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsService } from '../../services/microservices/reports/reports.service';
import { GeneratedReportsService } from '../../services/microservices/reports/generated-reports.service';
import { JobService } from '../../services/microservices/job/job.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [ReportsService, GeneratedReportsService, JobService],
})
export class GlobalsServiceModule {}
