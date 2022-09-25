import { Reports } from '../../../core/services/microservices/reports/interfaces/reportsResponse.interface';
export interface ReportsLocal extends Reports {
  reportType: ReportTypeLocal;
  reportGroup: ReportGroupLocal;
}

export interface ReportGroupLocal {
  id: string;
  internalName: string;
  name: string;
}

export interface ReportTypeLocal {
  id: string;
  internalName: string;
  name: string;
}
