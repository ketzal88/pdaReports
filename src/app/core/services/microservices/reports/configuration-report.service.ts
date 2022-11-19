import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { StepConfigurationResponse } from './interfaces/configuration-report.interface';

@Injectable()
export class ConfigurationReportService {
  basePath: string = environment.apiConfiguration;
  constructor(private httpClient: HttpClient) {}

  getStepConfiguration(): Observable<StepConfigurationResponse> {
    return this.httpClient.get<StepConfigurationResponse>(
      `${this.basePath}/step`
    );
  }
}
