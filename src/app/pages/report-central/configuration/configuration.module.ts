import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationComponent } from './configuration.component';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { StepCardModule } from '../../../shared/components/step-card/step-card.module';
import { LabelStepPipe } from './pipes/label-step.pipe';
import { SelectStyleComponent } from './select-style/select-style.component';
import { SelectIndividualsComponent } from './select-individuals/select-individuals.component';
import { MaterialModule } from '../../../shared/material/material.module';
import { FormsModule } from '@angular/forms';
import { InputModule } from '../../../shared/components/input/input.module';
import { GenderPipe } from '../../../core/pipes/gender.pipe';
import { SelectCompetenciesComponent } from './select-competencies/select-competencies.component';
import { SelectGroupComponent } from './select-group/select-group.component';
import { SelectJobsComponent } from './select-jobs/select-jobs.component';
import { TranslateModule } from '@ngx-translate/core';
import { UploaderModule } from 'src/app/shared/components/uploaders/image-uploader/uploaders.module';
import { MatCustomIndividualsTableModule } from 'src/app/shared/components/mat-custom-individuals-table/mat-custom-individuals-table.module';
import { SelectAreaLeaderComponent } from './select-area-leader/select-area-leader.component';
import { IndividualsModule } from 'src/app/shared/components/individuals/individuals.module';
import { ClientFilterModule } from '../../../shared/components/client-filter/client-filter.module';
import { SelectHrFeedbackComponent } from './select-hr-feedback/select-hr-feedback.component';
import { ResponseDialogModule } from '../../../shared/components/modal/response-dialog/response-dialog.module';
import { IconsModule } from '../../../shared/components/icons/icons.module';
import { ConfigurationService } from './configuration.service';
import { ConfigurationReportService } from '../../../core/services/microservices/reports/configuration-report.service';

@NgModule({
  declarations: [
    ConfigurationComponent,
    LabelStepPipe,
    SelectStyleComponent,
    SelectIndividualsComponent,
    GenderPipe,
    SelectCompetenciesComponent,
    SelectGroupComponent,
    SelectJobsComponent,
    SelectAreaLeaderComponent,
    SelectHrFeedbackComponent,
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    StepCardModule,
    MaterialModule,
    FormsModule,
    InputModule,
    MatCustomIndividualsTableModule,
    TranslateModule,
    UploaderModule,
    IndividualsModule,
    ClientFilterModule,
    ResponseDialogModule,
    IconsModule,
  ],
  exports: [
    ConfigurationComponent,
    LabelStepPipe,
    SelectStyleComponent,
    SelectIndividualsComponent,
  ],
  providers: [ConfigurationService, ConfigurationReportService],
})
export class ConfigurationModule {}
