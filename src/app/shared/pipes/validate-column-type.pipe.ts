import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Gender } from '../../core/services/microservices/individual/individual.interface';
import { TypeColumn } from '../components/mat-custom-individuals-table/consts/type-column.enum';

@Pipe({
  name: 'validateColumnType',
})
export class ValidateColumnTypePipe implements PipeTransform {
  transform(value: any, arg: string): any {
    if (arg === TypeColumn.DATE) {
      let datePipe = new DatePipe('en-US');
      value = datePipe.transform(value, 'dd-MM-yyyy');
      return value;
    }

    return value;
  }
}
