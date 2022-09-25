import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponseDialogComponent } from './response-dialog.component';
import { CardModule } from '../../card/card.module';
import { IconsModule } from '../../icons/icons.module';
import { MaterialModule } from '../../../material/material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ResponseDialogComponent],
  imports: [
    CommonModule,
    CardModule,
    IconsModule,
    MaterialModule,
    TranslateModule,
  ],
  exports: [ResponseDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ResponseDialogModule {}
