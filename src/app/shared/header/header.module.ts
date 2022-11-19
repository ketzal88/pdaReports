import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MaterialModule } from '../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '../components/icons/icons.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    FormsModule,
    IconsModule,
  ],
  exports: [HeaderComponent],
})
export class HeaderModule {}
