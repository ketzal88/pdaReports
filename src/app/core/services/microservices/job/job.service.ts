import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { GetJobsResponse, JobCategory } from './job.interface';

@Injectable()
export class JobService {
  basePath = environment.apiJobs;
  constructor(private httpClient: HttpClient) {}
  //TODO: Buscar "pageNumber?" y cambiarles los parametros a estos metodos, para que reciban un PaginatedRequest
  getJobs(
    jobId?: string,
    name?: string,
    baseId?: string,
    subbaseId?: string,
    jobCategoryId?: string,
    pageNumber?: number,
    pageSize?: number
  ): Observable<GetJobsResponse> {
    let queryParameters = new HttpParams();
    if (jobId !== undefined && jobId !== null) {
      queryParameters = queryParameters.set('JobId', <any>jobId);
    }
    if (name !== undefined && name !== null) {
      queryParameters = queryParameters.set('Name', <any>name);
    }
    if (baseId !== undefined && baseId !== null) {
      queryParameters = queryParameters.set('BaseId', <any>baseId);
    }
    if (subbaseId !== undefined && subbaseId !== null) {
      queryParameters = queryParameters.set('SubbaseId', <any>subbaseId);
    }
    if (jobCategoryId !== undefined && jobCategoryId !== null) {
      queryParameters = queryParameters.set(
        'JobCategoryId',
        <any>jobCategoryId
      );
    }
    if (pageNumber !== undefined && pageNumber !== null) {
      queryParameters = queryParameters.set('PageNumber', <any>pageNumber);
    }
    if (pageSize !== undefined && pageSize !== null) {
      queryParameters = queryParameters.set('PageSize', <any>pageSize);
    }

    return this.httpClient.get<GetJobsResponse>(`${this.basePath}/Jobs`, {
      params: queryParameters,
    });
  }

  getJobCategories(
    includeCustomized?: boolean
  ): Observable<Array<JobCategory>> {
    let queryParameters = new HttpParams();

    if (includeCustomized !== undefined && includeCustomized !== null) {
      queryParameters = queryParameters.set(
        'IncludeCustomized',
        <boolean>includeCustomized
      );
    }

    return this.httpClient.get<Array<JobCategory>>(
      `${this.basePath}/JobCategories`,
      {
        params: queryParameters,
      }
    );
  }
}
