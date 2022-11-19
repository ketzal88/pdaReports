import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportCentralComponent } from './report-central.component';
import { ReportCentralRoutingModule } from './report-central-routing.module';
import { MaterialModule } from '../../shared/material/material.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { TranslateModule } from '@ngx-translate/core';
import { IconsModule } from '../../shared/components/icons/icons.module';
import { DefaultsModule } from './defaults/defaults.module';
import { MyReportsModule } from './my-reports/my-reports.module';
import { MyTemplatesModule } from './my-templates/my-templates.module';

@NgModule({
  declarations: [ReportCentralComponent],
  imports: [
    CommonModule,
    ReportCentralRoutingModule,
    MaterialModule,
    ConfigurationModule,
    TranslateModule,
    IconsModule,
    DefaultsModule,
    MyReportsModule,
    MyTemplatesModule,
  ],
  exports: [ReportCentralComponent],
})
export class ReportCentralModule {}
