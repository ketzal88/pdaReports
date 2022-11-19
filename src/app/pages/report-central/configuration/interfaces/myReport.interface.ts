export class MyReport {
  id: string;
  shortId: string;

  style?: string;
  culture?: string;
  baseId: string;
  subBaseId?: string;
  individualIds: string[];
  feedbackText?: string;

  isTemplate?: boolean;
  name?: string;

  jobId?: string;
  jobCategoryId: string;
  competenciesIds?: string[];

  groupId: string;
  groupIndividuals: string[];

  areaId: string;
  areaIndividuals: string[];
  leaderIndividualId: string;
}
