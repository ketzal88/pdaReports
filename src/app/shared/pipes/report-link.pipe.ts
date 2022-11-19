import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'reportLink',
})
export class ReportLinkPipe implements PipeTransform {
  constructor() {}
  transform(value: any): any {
    return environment.reportURL + value;
  }
}
