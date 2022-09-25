export interface PDAGroupSectionsRequest {
  reportId: string;
  baseId: string;
  subbaseId: string;
  leaderIndividualId: string;
  individualsIds: string[];
  sectionsReportGroup: string[];
  jobParameters: JobParameters;
  competencyParameters: CompetencyParameters;
  includeGraphics: boolean;
}

export interface CompetencyParameters {
  competenciesId: string[];
  natural: boolean;
}

export interface JobParameters {
  jobsId: string[];
  natural: boolean;
}
