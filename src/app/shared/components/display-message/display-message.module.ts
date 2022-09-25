import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopUpComponent } from './pop-up/popUp.component';
import { MaterialModule } from '../../material/material.module';
import { SnackbarComponent } from './snackbar/snackbar.component';

@NgModule({
  declarations: [PopUpComponent, SnackbarComponent],
  imports: [CommonModule, MaterialModule],
})
export class DisplayMessageModule {}
