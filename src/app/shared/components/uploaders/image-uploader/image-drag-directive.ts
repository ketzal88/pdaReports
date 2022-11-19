import {
  Directive,
  HostListener,
  EventEmitter,
  Output,
  HostBinding,
} from '@angular/core';
import { ImageFileHandle } from './image-uploader.interface';
@Directive({
  selector: '[appImageDrag]',
})
export class ImageDragDirective {
  @Output() files: EventEmitter<ImageFileHandle[]> = new EventEmitter();
  // @HostBinding('style.background') background = '#eee';
  constructor() {}
  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    // this.background = '#999';
  }
  @HostListener('dragleave', ['$event']) onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    // this.background = '#eee';
  }
  @HostListener('drop', ['$event']) onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    // this.background = '#eee';
    let files: ImageFileHandle[] = [];
    for (let i = 0; i < evt.dataTransfer.files.length; i++) {
      const file = evt.dataTransfer.files[i];
      const url: any = window.URL.createObjectURL(file);
      let image = new ImageFileHandle(url, file);
      image.extensionType = evt.dataTransfer.files[i].type;
      image.size = evt.dataTransfer.files[i].size;

      files.push(image);
    }
    if (files.length > 0) {
      this.files.emit(files);
    }
  }
}
