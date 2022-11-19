import { GeneratedReport } from '../../../../core/services/microservices/reports/interfaces/generatedReportsResponse.interface';
export interface SendReportOptions {
  baseId: string;
  subbaseId: string;
  reportList: GeneratedReport[];
}
