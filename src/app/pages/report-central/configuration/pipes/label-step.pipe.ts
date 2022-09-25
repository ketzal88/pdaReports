import { Pipe, PipeTransform } from '@angular/core';
import { StepsService } from '../../../../core/services/steps.service';

@Pipe({
  name: 'labelStep',
})
export class LabelStepPipe implements PipeTransform {
  constructor(private stepsService: StepsService) {}

  transform(value: unknown, ...args: unknown[]): unknown {
    return value ? 'Continue' : 'Finish';
  }
}
