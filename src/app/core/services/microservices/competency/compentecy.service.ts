import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  GetCompetencyResponse,
  CompetencyCategory,
  Competency,
} from './competency.interface';

@Injectable()
export class CompetencyService {
  basePath = environment.apiCompetency;

  constructor(private httpClient: HttpClient) {}

  getCompetency(id: string): Observable<Competency> {
    return this.httpClient.get<Competency>(
      `${this.basePath}/Competencies/${id}`
    );
  }

  getCompetencies(
    competenciesIds?: string[],
    name?: string,
    competencyCategoryId?: string,
    pageNumber?: number,
    pageSize?: number
  ): Observable<GetCompetencyResponse> {
    let queryParameters = new HttpParams();
    if (name !== undefined && name !== null) {
      queryParameters = queryParameters.set('Name', name);
    }
    if (pageNumber !== undefined && pageNumber !== null) {
      queryParameters = queryParameters.set('PageNumber', <any>pageNumber);
    }
    if (pageSize !== undefined && pageSize !== null) {
      queryParameters = queryParameters.set('PageSize', <any>pageSize);
    }
    if (competencyCategoryId !== undefined && competencyCategoryId !== null) {
      queryParameters = queryParameters.set(
        'CompetencyCategoryId',
        <any>competencyCategoryId
      );
    }
    if (competenciesIds && competenciesIds.length > 0) {
      competenciesIds.forEach(competencyId => {
        queryParameters = queryParameters.append(
          'CompetenciesIds',
          competencyId
        );
      });
    }

    return this.httpClient.get<GetCompetencyResponse>(
      `${this.basePath}/Competencies`,
      {
        params: queryParameters,
      }
    );
  }

  getCompetencyCategories(name?: string): Observable<CompetencyCategory[]> {
    let queryParameters = new HttpParams();
    if (name !== undefined && name !== null) {
      queryParameters = queryParameters.set('Name', name);
    }

    return this.httpClient.get<CompetencyCategory[]>(
      `${this.basePath}/CompetencyCategories`,
      {
        params: queryParameters,
      }
    );
  }
}
