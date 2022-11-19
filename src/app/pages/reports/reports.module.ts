import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { DataProviderService } from '../../core/services/data-provider.service';

import { FormsModule } from '@angular/forms';
import { SectionsModule } from './sections/sections.module';
import { CardModule } from '../../shared/components/card/card.module';
import { InputModule } from '../../shared/components/input/input.module';
import { SeeMoreModule } from '../../shared/components/modal/see-more/see-more.module';
import { SendReportModule } from '../report-central/my-reports/send-report/send-report.module';
import { PdfGenerationModule } from 'src/app/shared/components/modal/pdf-generation/pdf-generation.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { ClientService } from 'src/app/core/services/microservices/client/client.service';
import { TippyService } from 'src/app/core/services/tippy.service';
import { StyleService } from '../../core/services/style/style.service';
import { CandidateReviewComponent } from './candidate-review/candidate-review.component';

@NgModule({
  declarations: [ReportsComponent, CandidateReviewComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SectionsModule,
    CardModule,
    FormsModule,
    InputModule,
    SeeMoreModule,
    PdfGenerationModule,
    SendReportModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  exports: [],
  providers: [DataProviderService, ClientService, TippyService, StyleService],
})
export class ReportsModule {}
