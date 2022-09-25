import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenderResponse } from './gender.interface';

@Injectable()
export class GenderService {
  basePath = environment.apiIndividual;

  constructor(private httpClient: HttpClient) {}

  getGenders(clientId: string): Observable<GenderResponse[]> {
    let queryParameters = new HttpParams();
    if (clientId !== undefined && clientId !== null) {
      queryParameters = queryParameters.set('ClientId', clientId);
    }
    return this.httpClient.get<GenderResponse[]>(
      `${this.basePath}/Gender/GetGenderLanguage`,
      {
        params: queryParameters,
      }
    );
  }
}
