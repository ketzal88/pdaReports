import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevelopmentComponent } from './reports/types/development/development.component';
import { SalesComponent } from './reports/types/sales/sales.component';
import { HiringComponent } from './reports/types/hiring/hiring.component';
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
import { IconSphereComponent } from './avatar/icon-sphere/icon-sphere.component';
import { IconRhombusComponent } from './avatar/icon-rhombus/icon-rhombus.component';
import { IconInfoCloseComponent } from './reports/icon-info-close/icon-info-close.component';
import { EmotionalIntelligenceComponent } from './reports/types/emotional-intelligence/emotional-intelligence.component';
import { ProfilesModule } from './profiles/profiles.module';
import { IconCopyClipboardComponent } from './actions/icon-copy-clipboard/icon-copy-clipboard.component';
import { IconRedirectComponent } from './icon-redirect/icon-redirect.component';
import { IconConfigurationReportComponent } from './my-reports/icon-configuration-report/icon-configuration-report.component';
import { IconUserComponent } from './user/icon-user/icon-user.component';
import { IconNotificationComponent } from './user/icon-notification/icon-notification.component';
import { IconFilterComponent } from './actions/icon-filter/icon-filter.component';
import { IconArrowComponent } from './icon-arrow/icon-arrow.component';
import { IconAUploadComponent } from './icon-aupload/icon-aupload.component';
import { IconHelpComponent } from './icon-help/icon-help.component';
import { IconTrashCanComponent } from './icon-trash-can/icon-trash-can.component';

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
    IconSphereComponent,
    IconRhombusComponent,
    IconInfoCloseComponent,
    EmotionalIntelligenceComponent,
    IconConfigurationReportComponent,
    IconCopyClipboardComponent,
    IconRedirectComponent,
    IconUserComponent,
    IconNotificationComponent,
    IconFilterComponent,
    IconArrowComponent,
    IconAUploadComponent,
    IconHelpComponent,
    IconTrashCanComponent,
  ],
  imports: [CommonModule, ProfilesModule],
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
    IconSphereComponent,
    IconRhombusComponent,
    IconInfoCloseComponent,
    EmotionalIntelligenceComponent,
    IconConfigurationReportComponent,
    IconCopyClipboardComponent,
    IconRedirectComponent,
    IconUserComponent,
    IconNotificationComponent,
    IconFilterComponent,
    IconArrowComponent,
    IconAUploadComponent,
    IconHelpComponent,
    IconTrashCanComponent,
  ],
})
export class IconsModule {}
