import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'noSectionData',
})
export class NoSectionDataPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}
  transform(value: any): any {
    if (!value || value === '') {
      value = this.translateService.instant('REPORTS.MISCELLANY');
    }

    return value;
  }
}
