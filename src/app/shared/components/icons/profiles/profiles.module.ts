import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicComponent } from './dynamic/dynamic.component';
import { InfluentialComponent } from './influential/influential.component';
import { LogicalComponent } from './logical/logical.component';

@NgModule({
  declarations: [DynamicComponent, InfluentialComponent, LogicalComponent],
  imports: [CommonModule],
  exports: [DynamicComponent, InfluentialComponent, LogicalComponent],
})
export class ProfilesModule {}
