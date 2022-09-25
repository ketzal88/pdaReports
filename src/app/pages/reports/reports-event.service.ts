import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReportEvent } from '../../core/consts/report-event.enum';

@Injectable()
export class ReportsEventService {
  currentReport$: BehaviorSubject<ReportEvent> =
    new BehaviorSubject<ReportEvent>(ReportEvent.NOT_REPORT);

  constructor() {}

  setCurrentReport(isReports: ReportEvent): void {
    this.currentReport$.next(isReports);
  }

  getCurrentReport(): Observable<ReportEvent> {
    return this.currentReport$.asObservable();
  }
}
