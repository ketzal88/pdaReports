import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepCardComponent } from './step-card.component';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  declarations: [StepCardComponent],
  imports: [CommonModule, MaterialModule],
  exports: [StepCardComponent],
})
export class StepCardModule {}
