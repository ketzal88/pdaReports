import { PaginatedResponse } from '../../paginatedResponse.interface';

export interface GeneratedReport {
  reportGeneratedId?: string;
  shortId?: string;
  reportTypeId?: string;

  firstName?: string;
  lastName?: string;
  email?: string;
  urlReport?: string;
  creationDate?: string;
  modificationDate?: string;
  userId?: string;
  baseId?: string;
  subBaseId?: string;
  reportId?: string;
  isPublic?: boolean;
  expirationDate?: string;
  individualId?: string;
  areaId?: string;
  groupId?: string;
  reportStyleId?: string;
  leaderIndividualId?: string;
  feedbackText?: string;

  //Optional:
  reportGeneratedJobs: ReportGeneratedJob[];
  reportGeneratedCompetencies: ReportGeneratedCompetency[];

  reportGeneratedAreaIndividuals: ReportGeneratedAreaIndividual[];
  reportGeneratedGroupingIndividuals: ReportGeneratedGroupingIndividual[];
}

export interface GeneratedReportsResponse
  extends PaginatedResponse<GeneratedReport> {}

export interface ReportGeneratedJob {
  reportGeneratedJobId?: string;
  reportGeneratedId?: string;
  jobId?: string;
}

export interface ReportGeneratedCompetency {
  reportGeneratedCompetencyId?: string;
  reportGeneratedId?: string;
  competencyId?: string;
}

export interface ReportGeneratedAreaIndividual {
  reportGeneratedAreaIndividualId?: string;
  reportGeneratedId?: string;
  areaIndividualId?: string;
}
export interface ReportGeneratedGroupingIndividual {
  reportGeneratedAreaIndividualId?: string;
  reportGeneratedId?: string;
  groupingIndividualId?: string;
}
