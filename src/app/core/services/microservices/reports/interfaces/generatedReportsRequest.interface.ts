import { PaginatedRequest } from '../../paginatedRequest.interface';
export interface GeneratedReportsRequest extends PaginatedRequest {
  reportGeneratedId?: string;
  ReportGeneratedShortId?: string;
  reportId?: string;
  reportTypeId?: string;
  baseId?: string;
  subbaseId?: string;
  individualId?: string;
  areaId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  filter?: string;
}
