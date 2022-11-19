import { Pipe, PipeTransform } from '@angular/core';
import { TypeFilter } from '../components/mat-custom-individuals-table/models/type-filter.interface';

@Pipe({
  name: 'reportType',
})
export class ReportTypePipe implements PipeTransform {
  transform(value: any, arg: TypeFilter[]): any {
    let reportGroupFound = '';
    let reportTypeFound = '';
    let found = false;
    for (let i = 0; i < arg.length && !found; i++) {
      reportGroupFound = arg[i].name;
      for (let j = 0; j < arg[i].data.length; j++) {
        if (value === arg[i].data[j].key) {
          reportTypeFound = arg[i].data[j].name;
          found = true;
        }
      }
    }

    return reportGroupFound + '/' + reportTypeFound;
  }
}
