import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusColorTypePipe } from './status-color-type.pipe';
import { ValidateColumnTypePipe } from './validate-column-type.pipe';

@NgModule({
  declarations: [StatusColorTypePipe, ValidateColumnTypePipe],
  imports: [CommonModule],
  exports: [StatusColorTypePipe, ValidateColumnTypePipe],
})
export class PipesModule {}
