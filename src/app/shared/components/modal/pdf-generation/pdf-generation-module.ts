import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from '../../card/card.module';
import { IconsModule } from '../../icons/icons.module';
import { MaterialModule } from '../../../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { PdfGenerationComponent } from './pdf-generation.component';

@NgModule({
  declarations: [PdfGenerationComponent],
  imports: [
    CommonModule,
    CardModule,
    IconsModule,
    MaterialModule,
    TranslateModule,
  ],
  exports: [PdfGenerationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PdfGenerationModule {}
