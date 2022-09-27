import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { DataProviderService } from '../../core/services/data-provider.service';

import { FormsModule } from '@angular/forms';
import { SectionsModule } from './sections/sections.module';
import { CardModule } from '../../shared/components/card/card.module';
import { InputModule } from '../../shared/components/input/input.module';
import { GlobalsServiceModule } from 'src/app/core/globals/globals-service/globals-service.module';

@NgModule({
  declarations: [
    ReportsComponent,
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SectionsModule,
    CardModule,
    FormsModule,
    InputModule,
    GlobalsServiceModule,
  ],
  exports: [],
  providers: [DataProviderService],
})
export class ReportsModule {}
