import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from './side-bar.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SideBarComponent],
  imports: [CommonModule, RouterModule, TranslateModule],
  exports: [SideBarComponent],
})
export class SideBarModule {}
