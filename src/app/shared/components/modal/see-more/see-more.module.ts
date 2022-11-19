import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeeMoreComponent } from './see-more.component';
import { CardModule } from '../../card/card.module';
import { MaterialModule } from '../../../material/material.module';
import { IconsModule } from '../../icons/icons.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SeeMoreComponent],
  imports: [
    CommonModule,
    CardModule,
    IconsModule,
    MaterialModule,
    TranslateModule,
  ],
  exports: [SeeMoreComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SeeMoreModule {}
