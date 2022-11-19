export interface ReportGeneratedRequest {
  reportGeneratedId?: string;
  creationDate?: Date;
  modificationDate?: Date;
  userId?: string;
  baseId?: string;
  subBaseId?: string;
  reportId?: string;
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
}

export interface ReportGeneratedCompetencyRequest {
  reportGeneratedCompetencyId?: string;
  competencyId?: string;
}

export interface ReportGeneratedJobRequest {
  reportGeneratedJobId?: string;
  jobId?: string;
}

/*
export interface ReportGeneratedAreaIndividualRequest {
  reportGeneratedAreaIndividualId?: string;
  areaIndividualId?: string;
}

export interface ReportGeneratedGroupingIndividualRequest {
  reportGeneratedGroupingIndividualId?: string;
  groupingIndividualId?: string;
}
*/
