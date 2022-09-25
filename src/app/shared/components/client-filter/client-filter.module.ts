import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientFilterComponent } from './client-filter.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ClientFilterComponent],
  imports: [CommonModule, FormsModule, MaterialModule, TranslateModule],
  exports: [ClientFilterComponent],
})
export class ClientFilterModule {}
