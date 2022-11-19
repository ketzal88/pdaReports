import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendReportComponent } from './send-report.component';
import { MaterialModule } from '../../../../shared/material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { InputModule } from '../../../../shared/components/input/input.module';
import { PipesModule } from '../../../../shared/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsModule } from '../../../../shared/components/icons/icons.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SendReportService } from './send-report.service';
import { ResponseDialogModule } from '../../../../shared/components/modal/response-dialog/response-dialog.module';

@NgModule({
  declarations: [SendReportComponent],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    InputModule,
    PipesModule,
    FormsModule,
    IconsModule,
    AngularEditorModule,
    ReactiveFormsModule,
    ResponseDialogModule
  ],
  exports: [SendReportComponent],
  providers: [SendReportService]
})
export class SendReportModule {}
