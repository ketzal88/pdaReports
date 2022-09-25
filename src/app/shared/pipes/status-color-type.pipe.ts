import { Pipe, PipeTransform } from '@angular/core';
import { Consistency } from '../../core/services/microservices/individual/individual.interface';

@Pipe({
  name: 'statusColorType',
})
export class StatusColorTypePipe implements PipeTransform {
  transform(value: any, args: any[]): any {
    if (args[0] === 'consistencyText') {
      const consistencyEnum = <Consistency>args[1].consistencyEnum;

      switch (consistencyEnum) {
        case Consistency.Consistent:
          return 'green';
        case Consistency.NotVeryConsistent:
          return 'gold';
        case Consistency.Invalid:
          return 'red';
        case Consistency.NotAvalaible:
          return 'black';
      }
    }
    return null;
  }
}
