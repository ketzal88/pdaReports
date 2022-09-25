export interface PDAIndividualSectionsRequest {
  reportId?: string;
  baseId?: string;
  subbaseId?: string;
  individualId?: string;
  sectionsReportPDA?: string[];
  jobParameters?: JobParameters;
  competencyParameters?: CompetencyParameters;
  includeGraphics?: boolean;
}

export interface CompetencyParameters {
  competenciesId: string[];
  natural: boolean;
}

export interface JobParameters {
  jobsId: string[];
  natural: boolean;
  includeAverage: boolean;
  includeCorrelationCompetency: boolean;
}
