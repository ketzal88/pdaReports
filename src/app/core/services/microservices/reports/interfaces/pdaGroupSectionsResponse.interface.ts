export interface PDAGroupSectionsResponse {
  urlReport?: string;
  managementStyle?: ManagementStyle;
  behavioralRadarChart?: BehavioralRadarChartGroup;
  effectiveLeadership?: EffectiveLeadership;
  keyAspects?: KeyAspects;
  keysToMotivate?: KeysToMotivate;
  predominantAxes?: PredominantAxes;
  profileModification?: EnergyBalance;
  energyBalance?: EnergyBalance;
  scatteringPercentagesChart?: ScatteringPercentagesChart;
  scatteringChart?: ScatteringChart;
  repnsTrends?: RepnsTrends;
  behavioralProfileChartAverage?: BehavioralProfileChartAverage;
  behavioralRadarChartGroupAverage?: BehavioralRadarChartGroupAverage;
  competencyCompatibility?: CompetencyCompatibility;
  jobCompatibility?: JobCompatibility;
  jobCompatibilityFromGroup?: JobCompatibilityFromGroup[];
}

export interface JobCompatibilityFromGroup {
  jobId: string;
  jobTitle: string;
  compatibilityPercentage: number;
  image?: string;
  individualName: string;
  individualId?: string;
  shortIndividualName?: string;
}

export interface BehavioralProfileChartAverage {
  title?: string;
  introduction?: string;
  repns?: Repns;
}

export interface Repns {
  r?: number;
  e?: number;
  p?: number;
  n?: number;
  s?: number;
}

export interface BehavioralRadarChartGroup {
  title?: string;
  image?: string;
  withoutLegendsImage?: string;
  introduction?: string;
  behavioralRadarChartCompetencies?: BehavioralRadarChartCompetency[];
  behavioralRadarChartCompetenciesCompatibility?: BehavioralRadarChartCompetenciesCompatibility[];
}

export interface BehavioralRadarChartCompetency {
  axis?: number;
  comeptencyId?: string;
  name?: string;
  description?: string;
}

export interface BehavioralRadarChartCompetenciesCompatibility {
  individualId?: string;
  comeptencyId?: string;
  natural?: number;
  role?: number;
}

export interface BehavioralRadarChartGroupAverage {
  title?: string;
  image?: string;
  withoutLegendsImage?: string;
  introduction?: string;
  behavioralAxiCompetencies?: Competency[];
}

export interface Competency {
  axi?: number;
  competencyId?: string;
  competencyName?: string;
  description?: string;
  natural?: number;
  role?: number;
  axiNumber?: number;
}

export interface CompetencyCompatibility {
  title?: string;
  introduction?: string;
  leftSideDescriptionWord?: string;
  rightSideDescriptionWord?: string;
  footer?: string;
  average?: number;
  competencyCompatibilityDetail?: CompetencyCompatibilityDetail[];
}

export interface CompetencyCompatibilityDetail {
  competency?: string;
  individual?: string;
  compatibilityPercentage?: number;
  image?: string;
  description?: string;
}

export interface EffectiveLeadership {
  introduction?: string;
  effectiveLeadershipDetails?: EffectiveLeadershipDetail[];
}

export interface EffectiveLeadershipDetail {
  title?: string;
  subtitle?: string;
  individualId?: string;
  descriptions?: string[];
}

export interface EnergyBalance {
  title?: string;
  introduction?: string;
  imageFooterLabel?: string;
  leftLabel?: string;
  rightLabel?: string;
  percentageDescription?: string;
  percentageValue?: number;
}

export interface JobCompatibility {
  jobCompatibilityDetailed?: JobCompatibilityDetailed;
  multipleJobCompatibility?: MultipleJobCompatibility[];
}

export interface JobCompatibilityDetailed {
  jobTitle?: string;
  jobDescription?: string;
  compatibility?: number;
  compatibilityDescription?: string;
  jobCompatibilityDetailedAxis?: JobCompatibilityDetailedAxi[];
  correlationJobBehavioralCompetencies?: Competency[];
}

export interface JobCompatibilityDetailedAxi {
  axis?: string;
  jobValue?: number;
  individualValue?: number;
  description?: string;
  isIntense?: boolean;
  individualName?: string;
  jobName?: string;
}

export interface MultipleJobCompatibility {
  jobId?: string;
  jobTitle?: string;
  compatibilityPercentage?: number;
  image?: string;
  individualName?: string;
}

export interface KeyAspects {
  title?: string;
  introduction?: string;
  keyAspectsDetails?: KeyAspectsDetail[];
}

export interface KeyAspectsDetail {
  individualId?: string;
  description?: string;
  leaderValue?: number;
  leaderStatus?: string;
  leaderIntense?: boolean;
  collaboratorValue?: number;
  collaboratorStatus?: string;
  collaboratorIntense?: boolean;
}

export interface KeysToMotivate {
  introduction?: string;
  keysToMotivateDetails?: KeysToMotivateDetail[];
}

export interface KeysToMotivateDetail {
  title?: string;
  individualId?: string;
  description?: string;
}

export interface ManagementStyle {
  title?: string;
  subtitle?: string;
  introduction?: string;
  leadershipTitle?: string;
  decisionMakingTitle?: string;
  communicationTitle?: string;
  decisionMakingDescriptions?: string[];
  leadershipDescriptions?: string[];
  communicationDescriptions?: string[];
}

export interface PredominantAxes {
  title?: string;
  introduction?: string;
  axesAndIndividuals?: AxesAndIndividual[];
}

export interface AxesAndIndividual {
  axesTitle?: string;
  axes?: string;
  individualNames?: string[];
  individualShortNames?: string[];
}

export interface RepnsTrends {
  title?: string;
  introduction?: string;
  individualInformation?: IndividualInformation[];
  markerLow?: string;
  markerHigh?: string;
  motivatorsHeader?: string;
  trendsHeader?: string;
  motivators_High_R?: string;
  motivators_Low_R?: string;
  trends_High_R?: string;
  trends_Low_R?: string;
  motivators_High_E?: string;
  motivators_Low_E?: string;
  trends_High_E?: string;
  trends_Low_E?: string;
  motivators_High_P?: string;
  motivators_Low_P?: string;
  trends_High_P?: string;
  trends_Low_P?: string;
  motivators_High_N?: string;
  motivators_Low_N?: string;
  trends_High_N?: string;
  trends_Low_N?: string;
  trends_High_S?: string;
  trends_Low_S?: string;
}

export interface IndividualInformation {
  number?: number;
  individualId?: string;
  individualName?: string;
  individualShortName?: string;
  valid?: boolean;
  r?: number;
  e?: number;
  p?: number;
  n?: number;
  s?: number;
  intensityR?: number;
  intensityE?: number;
  intensityP?: number;
  intensityN?: number;
  intensityS?: number;
  energyBalance?: number;
  profileModification?: number;
  sortingR?: number;
  sortingE?: number;
  sortingP?: number;
  sortingN?: number;
  sortingS?: number;
}

export interface ScatteringChart {
  title?: string;
  introduction?: string;
  individualInformation?: IndividualInformation[];
  groupScatteringChartAxes?: GroupScatteringChartAx[];
}

export interface GroupScatteringChartAx {
  axisTitle?: string;
  axisDescription?: string;
}

export interface ScatteringPercentagesChart {
  scatteringPercentages?: ScatteringPercentage[];
  title?: string;
  introduction?: string;
  titleR?: string;
  titleE?: string;
  titleP?: string;
  titleN?: string;
  labelHigh?: string;
  labelMedium?: string;
  labelLow?: string;
}

export interface ScatteringPercentage {
  axis?: string;
  levels?: Level[];
}

export interface Level {
  level?: string;
  levelName?: string;
  value?: number;
}
