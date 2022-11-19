import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  GroupingResponse,
  GroupingIndividual,
  GroupingRequest,
  GroupAddRequest,
} from './grouping.interface';

@Injectable()
export class GroupingService {
  basePath = environment.apiIndividual;
  constructor(private httpClient: HttpClient) {}

  getGroupings(request: GroupingRequest): Observable<GroupingResponse[]> {
    let queryParameters = new HttpParams();
    if (request.groupingId !== undefined && request.groupingId !== null) {
      queryParameters = queryParameters.set(
        'GroupingId',
        <string>request.groupingId
      );
    }
    if (request.name !== undefined && request.name !== null) {
      queryParameters = queryParameters.set('Name', <string>request.name);
    }
    if (request.baseId !== undefined && request.baseId !== null) {
      queryParameters = queryParameters.set('BaseId', <string>request.baseId);
    }
    if (request.subBaseId !== undefined && request.subBaseId !== null) {
      queryParameters = queryParameters.set(
        'SubbaseId',
        <string>request.subBaseId
      );
    }

    return this.httpClient.get<GroupingResponse[]>(
      `${this.basePath}/Grouping`,
      {
        params: queryParameters,
      }
    );
  }

  getGroupingById(id: string): Observable<GroupingResponse> {
    return this.httpClient.get<GroupingResponse>(
      `${this.basePath}/Grouping/${id}`
    );
  }

  addGrouping(grouping: GroupAddRequest): Observable<string> {
    let options: Object = {
      responseType: 'text',
    };
    return this.httpClient.post<string>(
      `${this.basePath}/Grouping`,
      grouping,
      options
    );
  }

  updateGrouping(
    id: string,
    grouping: GroupingRequest
  ): Observable<GroupingResponse> {
    let queryParameters = new HttpParams();

    if (id === null || id === undefined) {
      throw new Error('Id is required');
    }
    if (grouping.groupingId !== undefined && grouping.groupingId !== null) {
      queryParameters = queryParameters.set('id', <string>grouping.groupingId);
    }
    if (grouping.name !== undefined && grouping.name !== null) {
      queryParameters = queryParameters.set('Name', <string>grouping.name);
    }

    return this.httpClient.request<GroupingResponse>(
      'PATCH',
      `${this.basePath}/Grouping/${id}`,
      {
        params: queryParameters,
      }
    );
  }

  deleteGrouping(id: string): Observable<string> {
    if (id === null || id === undefined) {
      throw new Error('Id is required');
    }
    return this.httpClient.request<string>(
      'DELETE',
      `${this.basePath}/Grouping/${id}`,
      { responseType: 'text' as 'json' }
    );
  }

  getGroupingIndividuals(groupingId: string): Observable<GroupingIndividual[]> {
    return this.httpClient.request<GroupingIndividual[]>(
      'GET',
      `${this.basePath}/Grouping/${groupingId}/Individual`
    );
  }

  addGroupingIndividual(
    groupingId: string,
    individualIds: string[]
  ): Observable<string> {
    return this.httpClient.request<string>(
      'POST',
      `${this.basePath}/Grouping/${groupingId}/Individual`,
      {
        body: { individualIds },
        responseType: 'text' as 'json',
      }
    );
  }

  deleteGroupingIndividual(
    groupingId: string,
    individualIds: string[]
  ): Observable<string> {
    return this.httpClient.request<string>(
      'DELETE',
      `${this.basePath}/Grouping/${groupingId}/Individual`,
      { responseType: 'text' as 'json', body: individualIds }
    );
  }
}
