export interface PDAGroupSectionsRequest {
  reportGeneratedId?: string;
  reportId?: string;
  baseId?: string;
  subbaseId?: string;
  leaderIndividualId?: string;
  individualsIds?: string[];
  sectionsReportGroup?: string[];
  jobParameters?: JobParameters;
  competencyParameters?: CompetencyParameters;
  includeGraphics?: boolean;
}

export interface CompetencyParameters {
  competenciesId?: string[];
  natural?: boolean;
  includeAverage?: boolean;
}

export interface JobParameters {
  jobsId?: string[];
  natural?: boolean;
  includeAverage?: boolean;
  includeCorrelationCompetency?: boolean;
}
