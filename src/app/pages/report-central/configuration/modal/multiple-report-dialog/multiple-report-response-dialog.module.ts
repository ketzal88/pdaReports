import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MultipleReportResponseDialogComponent } from './multiple-report-response-dialog.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { CardModule } from 'src/app/shared/components/card/card.module';
import { IconsModule } from 'src/app/shared/components/icons/icons.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ReportLinkPipe } from '../../../../../shared/pipes/report-link.pipe';

@NgModule({
  declarations: [MultipleReportResponseDialogComponent],
  imports: [
    CommonModule,
    CardModule,
    IconsModule,
    MaterialModule,
    TranslateModule,
    PipesModule,
  ],
  exports: [MultipleReportResponseDialogComponent],
  providers: [
    {
      provide: ReportLinkPipe,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MultipleReportResponseDialogModule {}
