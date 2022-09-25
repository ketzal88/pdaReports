import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, Observable, take, pipe, concat, of } from 'rxjs';
import { PDAIndividualSectionsResponse } from './interfaces/pdaIndividualSectionsResponse.interface';
import { PDAGroupSectionsResponse } from './interfaces/pdaGroupSectionsResponse.interface';
import { PDAIndividualSectionsRequest } from './interfaces/pdaIndividualSectionsRequest.interface';
import { PDAGroupSectionsRequest } from './interfaces/pdaGroupSectionsRequest.interface';
import { ReportGroupResponse } from './interfaces/reportGroupResponse.interface';
import { ReportType } from './interfaces/reportTypeResponse.interface';
import { ReportsResponse } from './interfaces/reportsResponse.interface';
import { ReportsLocal } from 'src/app/pages/report-central/interfaces/reports-local.interface';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class ReportsService {
  currentReport$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(private httpClient: HttpClient) {}

  setCurrentReport(isReports: boolean): void {
    this.currentReport$.next(isReports);
  }

  getCurrentReport(): Observable<boolean> {
    return this.currentReport$.asObservable();
  }

  loadIndividualReport(
    request: PDAIndividualSectionsRequest
  ): Observable<PDAIndividualSectionsResponse> {
    return this.httpClient.post<PDAIndividualSectionsResponse>(
      `${environment.apiReports}/ReportGeneration/PDAIndividualSections`,
      request
    );
  }

  loadGroupReport(
    request: PDAGroupSectionsRequest
  ): Observable<PDAGroupSectionsResponse> {
    return this.httpClient.post<PDAGroupSectionsResponse>(
      `${environment.apiReports}/ReportGeneration/PDAGroupSections`,
      request
    );
  }

  getReportsGroup(): Observable<ReportGroupResponse[]> {
    return this.httpClient.get<ReportGroupResponse[]>(
      `${environment.apiReports}/ReportGroups`
    );
  }

  getReportsType(): Observable<ReportType[]> {
    return this.httpClient.get<ReportType[]>(
      `${environment.apiReports}/ReportTypes`
    );
  }
  //TODO: FALTAN PARAMETROS DEL ENDPOINT.
  getReports(): Observable<ReportsResponse> {
    return this.httpClient.get<ReportsResponse>(
      `${environment.apiReports}/Reports`
    );
  }

  getReportById(reportId: string): Observable<ReportsResponse> {
    let params = new HttpParams();
    params = params.set('ReportId', reportId);

    return this.httpClient.get<ReportsResponse>(
      `${environment.apiReports}/Reports`,
      { params: params }
    );
  }

  setReportsTypeForReportLocal(
    reportsResponse: ReportsResponse
  ): Observable<ReportsLocal[]> {
    return this.httpClient
      .get<ReportType[]>(`${environment.apiReports}/ReportTypes`)
      .pipe(
        map((resp: ReportType[]) => {
          let reportLocal = reportsResponse.data as ReportsLocal[];

          //Obtengo la lista de tipos de reportes
          let reportTypes = resp;

          //Armo lista de reportes a mostrar
          reportLocal = reportLocal.map(report => {
            //Seteo tipo de reporte
            const reportTypeLocal = reportTypes
              .filter(reportType => reportType.id === report.reportTypeId)
              .map(data => {
                return {
                  id: data.id,
                  internalName: data.internallName,
                  name: data.name,
                };
              })[0];
            report.reportType = reportTypeLocal;

            //Seteo tipo de grupo
            const reportGroupLocal = reportTypes
              .filter(reportType => reportType.id === report.reportTypeId)
              .map(data => {
                return {
                  id: data.reportGroup.id,
                  internalName: data.reportGroup.internalName,
                  name: data.reportGroup.name,
                };
              })[0];
            report.reportGroup = reportGroupLocal;
            return report;
          });
          return reportLocal;
        })
      );
  }

  getReportsLocal(reportId: string): Observable<ReportsLocal[]> {
    return this.getReportById(reportId).pipe(
      switchMap((response: ReportsResponse) => {
        return this.setReportsTypeForReportLocal(response);
      })
    );
  }
}
