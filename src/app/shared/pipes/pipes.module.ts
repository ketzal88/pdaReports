import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusColorTypePipe } from './status-color-type.pipe';
import { ValidateColumnTypePipe } from './validate-column-type.pipe';
import { NoSectionDataPipe } from './no-section-data.pipe';
import { ReportLinkPipe } from './report-link.pipe';
import { ReportTypePipe } from './report-type.pipe';
import { StepCardTranslationPipe } from './step-card-translation.pipe';

@NgModule({
  declarations: [
    StatusColorTypePipe,
    ValidateColumnTypePipe,
    NoSectionDataPipe,
    ReportLinkPipe,
    ReportTypePipe,
    StepCardTranslationPipe,
  ],
  imports: [CommonModule],
  exports: [
    StatusColorTypePipe,
    ValidateColumnTypePipe,
    NoSectionDataPipe,
    ReportLinkPipe,
    ReportTypePipe,
    StepCardTranslationPipe,
  ],
})
export class PipesModule {}
