import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTemplatesComponent } from './my-templates.component';
import { TableMyTemplatesComponent } from './table-my-templates/table-my-templates.component';
import { MaterialModule } from '../../../shared/material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { InputModule } from '../../../shared/components/input/input.module';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { IconsModule } from '../../../shared/components/icons/icons.module';
import { ClientFilterModule } from '../../../shared/components/client-filter/client-filter.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatCustomPaginatorIntlService } from '../../../shared/components/mat-custom-individuals-table/mat-custom-individuals-paginator-intl.service';
import { ReportLinkPipe } from 'src/app/shared/pipes/report-link.pipe';
import { ReportTypePickerComponent } from './modal/report-type-picker/report-type-picker.component';
import { DefaultsModule } from '../defaults/defaults.module';
import { InputDialogComponent } from './modal/input-dialog/input-dialog.component';

@NgModule({
  declarations: [
    MyTemplatesComponent,
    TableMyTemplatesComponent,
    ReportTypePickerComponent,
    InputDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    InputModule,
    PipesModule,
    CdkTableModule,
    FormsModule,
    MatSortModule,
    IconsModule,
    ClientFilterModule,
    ReactiveFormsModule,
    DefaultsModule,
  ],
  exports: [MyTemplatesComponent, ReportTypePickerComponent],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: MatCustomPaginatorIntlService,
    },
    {
      provide: ReportLinkPipe,
    },
  ],
})
export class MyTemplatesModule {}
