import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevelopmentComponent } from './development/development.component';
import { SalesComponent } from './sales/sales.component';
import { HiringComponent } from './hiring/hiring.component';
import { HappyComponent } from './profiles/happy/happy.component';
import { ShareReportComponent } from './my-reports/share-report/share-report.component';
import { WhatsappComponent } from './my-reports/whatsapp/whatsapp.component';
import { EmailComponent } from './my-reports/email/email.component';
import { IconEditComponent } from './actions/icon-edit/icon-edit.component';
import { IconCopyComponent } from './actions/icon-copy/icon-copy.component';
import { IconDeleteComponent } from './actions/icon-delete/icon-delete.component';
import { IconCloseComponent } from './actions/icon-close/icon-close.component';
import { IconErrorComponent } from './icon-error/icon-error.component';
import { IconSuccessComponent } from './icon-success/icon-success.component';
import { IconWarningComponent } from './icon-warning/icon-warning.component';

@NgModule({
  declarations: [
    HiringComponent,
    DevelopmentComponent,
    SalesComponent,
    HappyComponent,
    ShareReportComponent,
    WhatsappComponent,
    EmailComponent,
    IconEditComponent,
    IconCopyComponent,
    IconDeleteComponent,
    IconCloseComponent,
    IconErrorComponent,
    IconSuccessComponent,
    IconWarningComponent,
  ],
  imports: [CommonModule],
  exports: [
    HiringComponent,
    DevelopmentComponent,
    SalesComponent,
    HappyComponent,
    ShareReportComponent,
    WhatsappComponent,
    EmailComponent,
    IconEditComponent,
    IconCopyComponent,
    IconDeleteComponent,
    IconCloseComponent,
    IconErrorComponent,
    IconSuccessComponent,
    IconWarningComponent,
  ],
})
export class IconsModule {}
