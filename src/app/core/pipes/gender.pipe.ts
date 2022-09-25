import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'gender' })
export class GenderPipe implements PipeTransform {
  transform(value: null | boolean): string {
    return value === null ? 'No binario' : value ? 'Masculino' : 'Femenino';
  }
}
