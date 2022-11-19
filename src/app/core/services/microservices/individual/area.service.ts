import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  AreaIndividual,
  AreaRequest,
  AreaResponse,
  AreaAddRequest,
} from './area.interface';

@Injectable()
export class AreaService {
  basePath = environment.apiIndividual;
  constructor(private httpClient: HttpClient) {}

  getAreas(areaRequest: AreaRequest): Observable<AreaResponse[]> {
    let queryParameters = new HttpParams();
    if (areaRequest.areaId !== undefined && areaRequest.areaId !== null) {
      queryParameters = queryParameters.set(
        'AreaId',
        <string>areaRequest.areaId
      );
    }
    if (areaRequest.name !== undefined && areaRequest.name !== null) {
      queryParameters = queryParameters.set('Name', <string>areaRequest.name);
    }
    if (areaRequest.baseId !== undefined && areaRequest.baseId !== null) {
      queryParameters = queryParameters.set(
        'BaseId',
        <string>areaRequest.baseId
      );
    }
    if (areaRequest.subBaseId !== undefined && areaRequest.subBaseId !== null) {
      queryParameters = queryParameters.set(
        'SubBaseId',
        <string>areaRequest.subBaseId
      );
    }

    return this.httpClient.get<AreaResponse[]>(`${this.basePath}/Area`, {
      params: queryParameters,
    });
  }

  getArea(id: string): Observable<AreaResponse> {
    return this.httpClient.get<AreaResponse>(`${this.basePath}/Area/${id}`);
  }

  addArea(area: AreaAddRequest): Observable<string> {
    return this.httpClient.post<string>(`${this.basePath}/Area`, area, {
      responseType: 'text' as 'json',
    });
  }

  updateArea(id: string, area: AreaRequest): Observable<AreaResponse> {
    let queryParameters = new HttpParams();

    if (id === null || id === undefined) {
      throw new Error('Id is required');
    }
    if (area.areaId !== undefined && area.areaId !== null) {
      queryParameters = queryParameters.set('id', <string>area.areaId);
    }
    if (area.name !== undefined && area.name !== null) {
      queryParameters = queryParameters.set('Name', <string>area.name);
    }

    return this.httpClient.request<AreaResponse>(
      'PATCH',
      `${this.basePath}/Area/${id}`,
      {
        params: queryParameters,
      }
    );
  }

  deleteArea(id: string): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error('Id is required');
    }
    return this.httpClient.request<any>(
      'delete',
      `${this.basePath}/Area/${id}`
    );
  }

  getAreaIndividuals(areaId: string): Observable<AreaIndividual[]> {
    return this.httpClient.request<AreaIndividual[]>(
      'GET',
      `${this.basePath}/Area/${areaId}/Individual`
    );
  }

  addAreaIndividual(
    areaId: string,
    individualIds: string[]
  ): Observable<string> {
    return this.httpClient.request<string>(
      'POST',
      `${this.basePath}/Area/${areaId}/Individual`,
      {
        body: { individualIds: individualIds },
        responseType: 'text' as 'json',
      }
    );
  }

  deleteAreaIndividual(
    areaId: string,
    individualIds: string[]
  ): Observable<string> {
    return this.httpClient.request<string>(
      'DELETE',
      `${this.basePath}/Area/${areaId}/Individual`,
      { responseType: 'text' as 'json', body: individualIds }
    );
  }
}
