import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndividualsSelectionComponent } from './individuals-selection/individuals-selection.component';
import { FormsModule } from '@angular/forms';
import { InputModule } from '../input/input.module';
import { MatCustomIndividualsTableModule } from '../mat-custom-individuals-table/mat-custom-individuals-table.module';
import { MaterialModule } from '../../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { IndividualAggrupationComponent } from './modal/individual-aggrupation/individual-aggrupation.component';
import { IconsModule } from '../icons/icons.module';
import { ConfirmDialogComponent } from './modal/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    IndividualsSelectionComponent,
    IndividualAggrupationComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    InputModule,
    MatCustomIndividualsTableModule,
    TranslateModule,
    IconsModule,
  ],
  exports: [
    IndividualsSelectionComponent,
    IndividualAggrupationComponent,
    ConfirmDialogComponent,
  ],
})
export class IndividualsModule {}
