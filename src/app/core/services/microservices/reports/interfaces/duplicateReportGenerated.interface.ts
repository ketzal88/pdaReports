export interface DuplicateReportGeneratedResponse {
  individualId?: string;
  reportGeneratedId?: string;
  individualName?: string;
  ok?: boolean;
  errorMessage?: string;
}

export interface DuplicateReportGeneratedRequest {
  generatedReportId: string;
  newIndividualIds: string[];
  includeReportOwnerIndividual?: boolean;
  userId: string;
  subbaseId: string;
}
