import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PDAIndividualSectionsRequest } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsRequest.interface';
import { PDAIndividualSectionsResponse } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BehavioralGraphService {
  constructor(private httpClient: HttpClient) {}

  getCorrelationJobBehavioralCompetencies(
    request: PDAIndividualSectionsRequest
  ): Observable<PDAIndividualSectionsResponse> {
    return this.httpClient.post<PDAIndividualSectionsResponse>(
      `${environment.apiReports}/ReportGeneration/PDAIndividualSections`,
      request
    );
  }
}
