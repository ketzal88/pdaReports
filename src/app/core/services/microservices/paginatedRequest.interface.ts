import { HttpParams } from '@angular/common/http';

export interface PaginatedRequest {
  pageNumber?: number;
  pageSize?: number;
}

export function addPaginationParameters(
  queryParameters: HttpParams,
  request: PaginatedRequest
): HttpParams {
  if (request.pageNumber !== undefined && request.pageNumber !== null) {
    queryParameters = queryParameters.set('PageNumber', request.pageNumber);
  }
  if (request.pageSize !== undefined && request.pageSize !== null) {
    queryParameters = queryParameters.set('PageSize', request.pageSize);
  }

  return queryParameters;
}
