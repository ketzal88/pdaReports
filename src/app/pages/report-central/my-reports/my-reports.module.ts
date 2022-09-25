import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyReportsComponent } from './my-reports.component';
import { TableMyReportsComponent } from './table-my-reports/table-my-reports.component';
import { MaterialModule } from '../../../shared/material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { InputModule } from '../../../shared/components/input/input.module';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { CdkTableModule } from '@angular/cdk/table';
import { IconsModule } from '../../../shared/components/icons/icons.module';
import { SendReportComponent } from './send-report/send-report.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ClientFilterModule } from '../../../shared/components/client-filter/client-filter.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatCustomPaginatorIntlService } from '../../../shared/components/mat-custom-individuals-table/mat-custom-individuals-paginator-intl.service';

@NgModule({
  declarations: [
    MyReportsComponent,
    TableMyReportsComponent,
    SendReportComponent,
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
    AngularEditorModule,
    ClientFilterModule,
  ],
  exports: [MyReportsComponent],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: MatCustomPaginatorIntlService,
    },
  ],
})
export class MyReportsModule {}
