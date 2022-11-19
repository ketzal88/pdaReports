import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'stepCardTranslation' })
export class StepCardTranslationPipe implements PipeTransform {
  constructor() {}
  transform(value: any, args: string[]): any {
    let translationPrefix: string;
    let translationField: string;

    if (args[0]) {
      translationPrefix = args[0] + '.';
    }

    if (args[1]) {
      translationField = '.' + args[1];
    }

    return `${translationPrefix}${value}${translationField}`;
  }
}
