import { NgModule } from '@angular/core';
import { ImageUploaderComponent } from './image-uploader.component';
import { CommonModule } from '@angular/common';
import { ImageDragDirective } from './image-drag-directive';
import { TranslateModule } from '@ngx-translate/core';
import { IconsModule } from '../../icons/icons.module';

@NgModule({
  declarations: [ImageUploaderComponent, ImageDragDirective],
  imports: [CommonModule, TranslateModule, IconsModule],

  exports: [ImageUploaderComponent],
  providers: [ImageDragDirective],
})
export class UploaderModule {}
