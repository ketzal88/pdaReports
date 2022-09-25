import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PDAIndividualSectionsRequest } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsRequest.interface';
import { PDAIndividualSectionsResponse } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class JobCompatibilitySectionService {
  constructor(private httpClient: HttpClient) {}

  getJobCompatibility(
    request: PDAIndividualSectionsRequest
  ): Observable<PDAIndividualSectionsResponse> {
    return this.httpClient.post<PDAIndividualSectionsResponse>(
      `${environment.apiReports}/ReportGeneration/PDAIndividualSections`,
      request
    );
  }
}
