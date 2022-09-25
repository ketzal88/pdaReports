import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ClientResponse,
  CustomerLogoReportRequest,
  GetSubBasesRequest,
  GetSubBasesResponse,
} from './client.interface';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { addPaginationParameters } from '../paginatedRequest.interface';

@Injectable()
export class ClientService {
  basePath = environment.apiClient;

  constructor(private httpClient: HttpClient) {}

  getClient(id: string): Observable<ClientResponse> {
    return this.httpClient.get<ClientResponse>(`${this.basePath}/Client/${id}`);
  }

  getSubbases(request: GetSubBasesRequest): Observable<GetSubBasesResponse> {
    let queryParameters = new HttpParams();
    if (request.baseId !== undefined && request.baseId !== null) {
      queryParameters = queryParameters.set('baseId', <string>request.baseId);
    }

    if (request.name !== undefined && request.name !== null) {
      queryParameters = queryParameters.set('name', <string>request.name);
    }
    if (request.link !== undefined && request.link !== null) {
      queryParameters = queryParameters.set('link', <string>request.link);
    }
    if (request.subbaseId !== undefined && request.subbaseId !== null) {
      queryParameters = queryParameters.set(
        'subbaseId',
        <string>request.subbaseId
      );
    }
    queryParameters = addPaginationParameters(queryParameters, request);

    return this.httpClient.get<GetSubBasesResponse>(
      `${this.basePath}/Subbase`,
      { params: queryParameters }
    );
  }

  updateClientLogo(request: CustomerLogoReportRequest): Observable<string> {
    let queryParameters = new HttpParams();
    if (request.id !== undefined && request.id !== null) {
      queryParameters = queryParameters.set('id', <string>request.id);
    }
    if (request.logoPath !== undefined && request.logoPath !== null) {
      queryParameters = queryParameters.set(
        'logoPath',
        <string>request.logoPath
      );
    }
    return this.httpClient.request<string>(
      'PATCH',
      `${this.basePath}/Client/${request.id}/ReportLogo`,
      {
        params: queryParameters,
      }
    );
  }
}
