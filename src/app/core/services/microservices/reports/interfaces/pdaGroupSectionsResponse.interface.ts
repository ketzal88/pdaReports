export interface PDAGroupSectionsResponse {
  urlReport: null;
  managementStyle: ManagementStyle;
  behavioralRadarChart: BehavioralRadarChart;
  effectiveLeadership: EffectiveLeadership;
  keyAspects: KeyAspects;
  keysToMotivate: KeysToMotivate;
  predominantAxes: PredominantAxes;
  profileModification: EnergyBalance;
  energyBalance: EnergyBalance;
  scatteringPercentagesChart: ScatteringPercentagesChart;
  scatteringChart: null;
  repnsTrends: RepnsTrends;
  behavioralProfileChartAverage: BehavioralProfileChartAverage;
  behavioralRadarChartGroupAverage: BehavioralRadarChartGroupAverage;
  competencyCompatibility: CompetencyCompatibility;
  jobCompatibility: JobCompatibility;
}

export interface BehavioralProfileChartAverage {
  title: string;
  introduction: string;
  repns: Repns;
}

export interface Repns {
  r: number;
  e: number;
  p: number;
  n: number;
  s: number;
}

export interface BehavioralRadarChart {
  title: string;
  image: null;
  withoutLegendsImage: null;
  introduction: string;
  behavioralRadarChartCompetencies: BehavioralRadarChartCompetency[];
  behavioralRadarChartCompetenciesCompatibility: BehavioralRadarChartCompetenciesCompatibility[];
}

export interface BehavioralRadarChartCompetency {
  axis: number;
  comeptencyId: string;
  name: string;
  description: string;
}

export interface BehavioralRadarChartCompetenciesCompatibility {
  individualId: string;
  comeptencyId: string;
  natural: number;
  role: number;
}

export interface BehavioralRadarChartGroupAverage {
  title: string;
  image: null;
  withoutLegendsImage: null;
  introduction: string;
  behavioralAxiCompetencies: BehavioralAxiCompetency[];
}

export interface BehavioralAxiCompetency {
  axi: number;
  competencyId: string;
  competencyName: string;
  description: string;
  natural: number;
  role: number;
}

export interface CompetencyCompatibility {
  title: string;
  introduction: string;
  leftSideDescriptionWord: string;
  rightSideDescriptionWord: string;
  footer: string;
  competencyCompatibilityDetail: CompetencyCompatibilityDetail[];
}

export interface CompetencyCompatibilityDetail {
  competency: string;
  individual: string;
  compatibilityPercentage: number;
  image: null;
  description: string;
}

export interface EffectiveLeadership {
  introduction: string;
  effectiveLeadershipDetails: EffectiveLeadershipDetail[];
}

export interface EffectiveLeadershipDetail {
  title: string;
  subtitle: string;
  individualId: string;
  descriptions: string[];
}

export interface EnergyBalance {
  title: string;
  introduction: string;
  imageFooterLabel: string;
  leftLabel: string;
  rightLabel: string;
  percentageDescription: string;
  percentageValue: number;
}

export interface JobCompatibility {
  jobCompatibilityDetailed: null;
  multipleJobCompatibility: MultipleJobCompatibility[];
}

export interface MultipleJobCompatibility {
  jobTitle: string;
  compatibilityPercentage: number;
  image: null;
  individualName: string;
}

export interface KeyAspects {
  title: string;
  introduction: string;
  keyAspectsDetails: KeyAspectsDetail[];
}

export interface KeyAspectsDetail {
  individualId: string;
  description: string;
  leaderValue: number;
  leaderStatus: RStatus;
  leaderIntense: boolean;
  collaboratorValue: number;
  collaboratorStatus: RStatus;
  collaboratorIntense: boolean;
}

export enum RStatus {
  A = 'A',
  B = 'B',
}

export interface KeysToMotivate {
  introduction: string;
  keysToMotivateDetails: KeysToMotivateDetail[];
}

export interface KeysToMotivateDetail {
  title: string;
  individualId: string;
  description: string;
}

export interface ManagementStyle {
  title: string;
  subtitle: string;
  introduction: string;
  leadershipTitle: string;
  decisionMakingTitle: string;
  communicationTitle: string;
  decisionMakingDescriptions: string[];
  leadershipDescriptions: string[];
  communicationDescriptions: string[];
}

export interface PredominantAxes {
  title: string;
  introduction: string;
  axesAndIndividuals: AxesAndIndividual[];
}

export interface AxesAndIndividual {
  axesTitle: string;
  axes: string;
  individualNames: string[];
  individualShortNames: string[];
}

export interface RepnsTrends {
  title: string;
  introduction: string;
  individualInformation: IndividualInformation[];
  markerLow: MarkerHigh;
  markerHigh: MarkerHigh;
  motivatorsHeader: string;
  trendsHeader: string;
  motivators_High_R: string;
  motivators_Low_R: string;
  trends_High_R: string;
  trends_Low_R: string;
  motivators_High_E: string;
  motivators_Low_E: string;
  trends_High_E: string;
  trends_Low_E: string;
  motivators_High_P: string;
  motivators_Low_P: string;
  trends_High_P: string;
  trends_Low_P: string;
  motivators_High_N: string;
  motivators_Low_N: string;
  trends_High_N: string;
  trends_Low_N: string;
  trends_High_S: string;
  trends_Low_S: string;
}

export interface IndividualInformation {
  number: number;
  individualId: string;
  individualName: string;
  individualShortName: string;
  valid: boolean;
  r: number;
  e: number;
  p: number;
  n: number;
  s: number;
  intensityR: number;
  intensityE: number;
  intensityP: number;
  intensityN: number;
  intensityS: number;
  energyBalance: number;
  profileModification: number;
  sortingR: number;
  sortingE: number;
  sortingP: number;
  sortingN: number;
  sortingS: number;
}

export enum MarkerHigh {
  High = 'High',
  Low = 'Low',
  Medium = 'Medium',
}

export interface ScatteringPercentagesChart {
  scatteringPercentages: ScatteringPercentage[];
  title: string;
  introduction: string;
  titleR: string;
  titleE: string;
  titleP: string;
  titleN: string;
  labelHigh: MarkerHigh;
  labelMedium: string;
  labelLow: MarkerHigh;
}

export interface ScatteringPercentage {
  axis: string;
  levels: LevelElement[];
}

export interface LevelElement {
  level: LevelEnum;
  levelName: MarkerHigh;
  value: number;
}

export enum LevelEnum {
  H = 'H',
  L = 'L',
  M = 'M',
}
