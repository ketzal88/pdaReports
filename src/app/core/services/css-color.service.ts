import { Injectable } from '@angular/core';
import {
  reportsType,
  TypeStyleReport,
} from '../configs/type-style-reports.config';
import { LocalStorageService } from './local-storage.service';

//Agregar los campos definidos en variables.scss sin '--'
export enum PropertyNames {
  backgroundColor = 'backgroundColor',
}

@Injectable()
export class CssColorService {
  private reportsType = reportsType;

  constructor(private localStorageService: LocalStorageService) {}

  loadColors(): void {
    const reportTypeStyle = this.localStorageService.getValue('style');
    if (reportTypeStyle) {
      this.setColor(reportTypeStyle);
    }
  }

  setColor(typeStyleReport: string): void {
    //TODO: Revisar perfomance cuando haya mas de 15 variables
    const typeReportFound = this.reportsType.find(
      (data: TypeStyleReport) => data.key === typeStyleReport
    );
    if (typeStyleReport !== 'pda' && typeReportFound) {
      this.localStorageService.setValue('style', typeStyleReport);
      Object.values(PropertyNames).forEach(propertyName => {
        document.documentElement.style.setProperty(
          `--${propertyName}`,
          typeReportFound.style[propertyName]
        );
      });
    }
  }
}
