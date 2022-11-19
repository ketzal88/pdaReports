import { PaginatedRequest } from '../../paginatedRequest.interface';
export interface GeneratedReportsRequest extends PaginatedRequest {
  reportGeneratedId?: string;
  reportId?: string;
  ReportGeneratedShortId?: string;
  baseId?: string;
  subbaseId?: string;
  individualId?: string;
  areaId?: string;
  reportTypeIds?: string[];
  firstName?: string;
  lastName?: string;
  email?: string;
  filter?: string;
  name?: string;
  isTemplate?: boolean;
}
