import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCustomIndividualsTableComponent } from './mat-custom-individuals-table.component';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MaterialModule } from '../../material/material.module';
import { InputModule } from '../input/input.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatCustomPaginatorIntlService } from './mat-custom-individuals-paginator-intl.service';
import { PipesModule } from '../../pipes/pipes.module';
import { IconsModule } from '../icons/icons.module';

@NgModule({
  declarations: [MatCustomIndividualsTableComponent],
  imports: [
    CommonModule,
    CdkTableModule,
    FormsModule,
    MatSortModule,
    MaterialModule,
    InputModule,
    TranslateModule,
    PipesModule,
    IconsModule,
  ],
  exports: [MatCustomIndividualsTableComponent],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: MatCustomPaginatorIntlService,
    },
  ],
})
export class MatCustomIndividualsTableModule {}
