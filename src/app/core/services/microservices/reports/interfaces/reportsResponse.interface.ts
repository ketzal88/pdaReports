export interface ReportsResponse {
  pageNumber: number;
  pageSize: number;
  firstPage: string;
  lastPage: string;
  totalPages: number;
  totalRecords: number;
  nextPage: null;
  previousPage: null;
  data: Reports[];
}

export interface Reports {
  reportId: string;
  businessUnitId: null;
  baseId: null;
  subbaseId: null;
  productTypeId: number;
  creationDate: Date;
  name: string;
  description: null;
  html_MasterPage?: string;
  html_Cover?: string;
  html_Header?: string;
  html_Footer?: string;
  css_Url: string;
  reportTypeId?: string;
}
