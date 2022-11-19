import { PaginatedResponse } from '../../paginatedResponse.interface';

export interface GeneratedReport {
  reportGeneratedId?: string;
  shortId?: string;
  reportId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  reportTypeId?: string;
  urlReport?: string;
  creationDate?: Date;
  modificationDate?: Date;
  userId?: string;
  baseId?: string;
  subBaseId?: string;
  isPublic?: boolean;
  expirationDate?: Date;
  individualId?: string;
  areaId?: string;
  groupId?: string;
  reportStyleId?: string;
  leaderIndividualId?: string;
  feedbackText?: string;
  pdaAssessmentOutcomeId?: string;
  name?: string;
  isTemplate?: boolean;

  // //Optional:
  // reportGeneratedJobs?: ReportGeneratedJob[];
  // reportGeneratedCompetencies?: ReportGeneratedCompetency[];

  // reportGeneratedAreaIndividuals?: ReportGeneratedAreaIndividual[];
  // reportGeneratedGroupingIndividuals?: ReportGeneratedGroupingIndividual[];
}

export interface GeneratedReportByIdResponse {
  reportGeneratedAreaIndividuals?: ReportGeneratedAreaIndividual[];
  reportGeneratedGroupingIndividuals?: ReportGeneratedGroupingIndividual[];
  reportGeneratedCompetencies?: ReportGeneratedCompetency[];
  reportGeneratedJobs?: ReportGeneratedJob[];
  reportGeneratedId: string;
  creationDate: Date;
  modificationDate: Date;
  userId: string;
  baseId: string;
  subBaseId: string;
  reportId: string;
  isPublic: boolean;
  expirationDate: Date;
  individualId?: string;
  areaId?: string;
  groupId?: string;
  reportStyleId?: string;
  leaderIndividualId?: string;
  feedbackText?: string;
  pdaAssessmentOutcomeId?: string;
  isTemplate: boolean;
  name?: string;
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
  individualId?: string;
}
export interface ReportGeneratedGroupingIndividual {
  reportGeneratedAreaIndividualId?: string;
  reportGeneratedId?: string;
  individualId?: string;
}
