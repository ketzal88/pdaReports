import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepCardComponent } from './step-card.component';
import { MaterialModule } from '../../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../pipes/pipes.module';
import { IconsModule } from '../icons/icons.module';

@NgModule({
  declarations: [StepCardComponent],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    PipesModule,
    IconsModule,
  ],
  exports: [StepCardComponent],
})
export class StepCardModule {}
