import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { GeneratedReportsRequest } from './interfaces/generatedReportsRequest.interface';
import {
  GeneratedReportsResponse,
  GeneratedReport,
  ReportGeneratedJob,
  ReportGeneratedCompetency,
} from './interfaces/generatedReportsResponse.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { addPaginationParameters } from '../paginatedRequest.interface';
import {
  ReportGeneratedCompetencyRequest,
  ReportGeneratedJobRequest,
  ReportGeneratedRequest,
} from './interfaces/reportGeneratedRequest.interface';

@Injectable()
export class GeneratedReportsService {
  basePath = environment.apiReports;

  constructor(private httpClient: HttpClient) {}

  loadGeneratedReports(
    request: GeneratedReportsRequest
  ): Observable<GeneratedReportsResponse> {
    let queryParameters = new HttpParams();
    if (
      request.reportGeneratedId !== undefined &&
      request.reportGeneratedId !== null
    ) {
      queryParameters = queryParameters.set(
        'ReportGeneratedId',
        <string>request.reportGeneratedId
      );
    }

    if (
      request.ReportGeneratedShortId !== undefined &&
      request.ReportGeneratedShortId !== null
    ) {
      queryParameters = queryParameters.set(
        'ReportGeneratedShortId',
        <string>request.ReportGeneratedShortId
      );
    }

    if (request.reportId !== undefined && request.reportId !== null) {
      queryParameters = queryParameters.set(
        'ReportId',
        <string>request.reportId
      );
    }

    if (request.reportTypeId !== undefined && request.reportTypeId !== null) {
      queryParameters = queryParameters.set(
        'ReportTypeId',
        <string>request.reportTypeId
      );
    }

    if (request.baseId !== undefined && request.baseId !== null) {
      queryParameters = queryParameters.set('BaseId', <string>request.baseId);
    }
    if (request.subbaseId !== undefined && request.subbaseId !== null) {
      queryParameters = queryParameters.set(
        'SubbaseId',
        <any>request.subbaseId
      );
    }
    if (request.individualId !== undefined && request.individualId !== null) {
      queryParameters = queryParameters.set(
        'IndividualId',
        <string>request.individualId
      );
    }
    if (request.areaId !== undefined && request.areaId !== null) {
      queryParameters = queryParameters.set('AreaId', <string>request.areaId);
    }
    if (request.firstName !== undefined && request.firstName !== null) {
      queryParameters = queryParameters.set(
        'FirstName',
        <string>request.firstName
      );
    }
    if (request.lastName !== undefined && request.lastName !== null) {
      queryParameters = queryParameters.set(
        'LastName',
        <string>request.lastName
      );
    }
    if (request.email !== undefined && request.email !== null) {
      queryParameters = queryParameters.set('Email', <string>request.email);
    }

    if (request.filter !== undefined && request.filter !== null) {
      queryParameters = queryParameters.set('Filter', <string>request.filter);
    }

    queryParameters = addPaginationParameters(queryParameters, request);

    return this.httpClient.get<GeneratedReportsResponse>(
      `${environment.apiReports}/ReportGenerated`,
      {
        params: queryParameters,
      }
    );
  }

  getGeneratedReportById(guidId: string): Observable<GeneratedReport> {
    return this.httpClient.get<GeneratedReport>(
      `${environment.apiReports}/ReportGenerated/${guidId}`
    );
  }

  getReportGeneratedJobs(guidId: string): Observable<ReportGeneratedJob[]> {
    return this.httpClient.get<ReportGeneratedJob[]>(
      `${environment.apiReports}/ReportGenerated/${guidId}/Job`
    );
  }

  getReportGeneratedCompetencies(
    guidId: string
  ): Observable<ReportGeneratedCompetency[]> {
    return this.httpClient.get<ReportGeneratedCompetency[]>(
      `${environment.apiReports}/ReportGenerated/${guidId}/Competency`
    );
  }

  getGeneratedReportByShortId(
    shortId: string,
    includeRelations: boolean = true
  ): Observable<GeneratedReport> {
    let queryParameters = new HttpParams();
    queryParameters = queryParameters.set('includeRelations', includeRelations);

    return this.httpClient.get<GeneratedReport>(
      `${environment.apiReports}/ReportGenerated/${shortId}`,
      {
        params: queryParameters,
      }
    );
  }

  generateReport(request: ReportGeneratedRequest): Observable<string> {
    return this.httpClient.post<string>(
      `${environment.apiReports}/ReportGenerated`,
      request
    );
  }

  generateCompetencyByReport(
    reportGeneratedId: string,
    request: ReportGeneratedCompetencyRequest[]
  ): Observable<string> {
    return this.httpClient.post<string>(
      `${environment.apiReports}/ReportGenerated/${reportGeneratedId}/Competency`,
      request
    );
  }

  generateJobByReport(
    reportGeneratedId: string,
    request: ReportGeneratedJobRequest[]
  ): Observable<string> {
    return this.httpClient.post<string>(
      `${environment.apiReports}/ReportGenerated/${reportGeneratedId}/Job`,
      request
    );
  }
}
