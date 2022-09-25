import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { addPaginationParameters } from '../paginatedRequest.interface';
import {
  GetAllIndividualRequest,
  GetAllIndividualResponse,
  GetAllIndividualWithBehaviouralProfileRequest,
  GetAllIndividualWithBehaviouralProfileResponse,
} from './individual.interface';

@Injectable()
export class IndividualService {
  basePath = environment.apiIndividual;
  constructor(private httpClient: HttpClient) {}

  getAllIndividuals(
    request: GetAllIndividualRequest
  ): Observable<GetAllIndividualResponse> {
    let queryParameters = new HttpParams();
    if (request.id !== undefined && request.id !== null) {
      queryParameters = queryParameters.set('Id', <string>request.id);
    }
    if (request.baseId !== undefined && request.baseId !== null) {
      queryParameters = queryParameters.set('BaseId', <any>request.baseId);
    }
    if (request.email !== undefined && request.email !== null) {
      queryParameters = queryParameters.set('Email', <any>request.email);
    }
    if (request.firstName !== undefined && request.firstName !== null) {
      queryParameters = queryParameters.set(
        'FirstName',
        <any>request.firstName
      );
    }
    if (request.lastName !== undefined && request.lastName !== null) {
      queryParameters = queryParameters.set('LastName', <any>request.lastName);
    }
    if (request.gender !== undefined && request.gender !== null) {
      queryParameters = queryParameters.set('Gender', <any>request.gender);
    }
    if (request.languageId !== undefined && request.languageId !== null) {
      queryParameters = queryParameters.set(
        'LanguageId',
        <any>request.languageId
      );
    }
    if (request.sendPDAReport !== undefined && request.sendPDAReport !== null) {
      queryParameters = queryParameters.set(
        'SendPDAReport',
        <any>request.sendPDAReport
      );
    }
    if (request.creationDate !== undefined && request.creationDate !== null) {
      queryParameters = queryParameters.set(
        'CreationDate',
        <any>request.creationDate.toISOString()
      );
    }
    if (
      request.modificationDate !== undefined &&
      request.modificationDate !== null
    ) {
      queryParameters = queryParameters.set(
        'ModificationDate',
        <any>request.modificationDate.toISOString()
      );
    }
    if (request.enterByWs !== undefined && request.enterByWs !== null) {
      queryParameters = queryParameters.set(
        'EnterByWs',
        <boolean>request.enterByWs
      );
    }
    if (request.date !== undefined && request.date !== null) {
      queryParameters = queryParameters.set(
        'Date',
        <any>request.date.toISOString()
      );
    }
    if (
      request.withoutPDAComplete !== undefined &&
      request.withoutPDAComplete !== null
    ) {
      queryParameters = queryParameters.set(
        'WithoutPDAComplete',
        <number>request.withoutPDAComplete
      );
    }
    if (request.birthDate !== undefined && request.birthDate !== null) {
      queryParameters = queryParameters.set(
        'BirthDate',
        <any>request.birthDate.toISOString()
      );
    }
    addPaginationParameters(queryParameters, request);

    return this.httpClient.get<GetAllIndividualResponse>(
      `${this.basePath}/Individuals`,
      {
        params: queryParameters,
      }
    );
  }

  getAllIndividualsWithBehavioralProfile(
    request: GetAllIndividualWithBehaviouralProfileRequest
  ): Observable<GetAllIndividualWithBehaviouralProfileResponse> {
    let queryParameters = new HttpParams();
    if (request.baseId !== undefined && request.baseId !== null) {
      queryParameters = queryParameters.set('BaseId', <any>request.baseId);
    }
    if (request.subbaseId !== undefined && request.subbaseId !== null) {
      queryParameters = queryParameters.set(
        'SubbaseId',
        <any>request.subbaseId
      );
    }

    if (request.filter !== undefined && request.filter !== null) {
      queryParameters = queryParameters.set('Filter', <any>request.filter);
    }

    if (request.genderList !== undefined && request.genderList !== null) {
      request.genderList.forEach(genderFilter => {
        queryParameters = queryParameters.append('Gender', genderFilter);
      });
    }

    if (
      request.consistencyList !== undefined &&
      request.consistencyList !== null
    ) {
      request.consistencyList.forEach(consistencyFilter => {
        queryParameters = queryParameters.append(
          'Consistency',
          consistencyFilter
        );
      });
    }

    if (request.dateFrom !== undefined && request.dateFrom !== null) {
      queryParameters = queryParameters.set('DateFrom', <any>request.dateFrom);
    }

    if (request.dateTo !== undefined && request.dateTo !== null) {
      queryParameters = queryParameters.set('DateTo', <any>request.dateTo);
    }

    if (request.areaId !== undefined && request.areaId !== null) {
      queryParameters = queryParameters.set('AreaId', <string>request.areaId);
    }
    if (request.groupingId !== undefined && request.groupingId !== null) {
      queryParameters = queryParameters.set(
        'GroupingId',
        <string>request.groupingId
      );
    }

    queryParameters = addPaginationParameters(queryParameters, request);

    return this.httpClient.get<GetAllIndividualWithBehaviouralProfileResponse>(
      `${this.basePath}/Individuals/GetAllIndividualWithBehaviouralProfile`,
      {
        params: queryParameters,
      }
    );
  }
}
