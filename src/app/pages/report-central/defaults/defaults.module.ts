import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultsComponent } from './defaults.component';
import { MaterialModule } from '../../../shared/material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { IconsModule } from '../../../shared/components/icons/icons.module';

@NgModule({
  declarations: [DefaultsComponent],
  imports: [CommonModule, TranslateModule, IconsModule, MaterialModule],
  exports: [DefaultsComponent],
})
export class DefaultsModule {}
