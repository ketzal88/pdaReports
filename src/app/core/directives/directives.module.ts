import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllownumbersonlyDirective } from './allownumbersonly.directive';

@NgModule({
  declarations: [AllownumbersonlyDirective],
  imports: [CommonModule],
  exports: [AllownumbersonlyDirective],
})
export class DirectivesModule {}
