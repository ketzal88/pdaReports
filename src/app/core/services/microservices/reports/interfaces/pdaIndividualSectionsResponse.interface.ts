export interface PDAIndividualSectionsResponse {
  coverIndividual: CoverIndividual;
  introduction: Introduction;
  consistencyIndicator: ConsistencyIndicator;
  pdaCharts: PDAChart[];
  behavioralDescriptors: BehavioralDescriptors;
  behavioralProfileDescription: BehavioralProfileDescription;
  managementStyle: ManagementStyle;
  salesStyle: SalesStyle;
  effectiveLeadership: EffectiveLeadership;
  strengthsOverused: StrengthsOverused;
  currentSituation: CurrentSituation;
  behavioralProfileChart: BehavioralProfileChart;
  selfDescription: Introduction;
  radarChart: RadarChart;
  wheelChart: WheelChart;
  behavioralRadarChart: BehavioralRadarChart;
  behavioralTrend: BehavioralTrend;
  emotionalIntelligence: EmotionalIntelligence;
  competencyCompatibility: CompetencyCompatibility;
  jobCompatibility: JobCompatibility;
  behavioralProfileImage: BehavioralProfileImage;
  behavioralProfileNaturalBrief: BehavioralProfileNaturalBrief;
  developmentTips: DevelopmentTips;
  developmentPlan: DevelopmentPlan;
  hrFeedback: HRFeedback;
  audiovisualContent: AudiovisualContent;
}

export interface AudiovisualContent {
  title: string;
  introduction: string;
  resourceURL: string;
}

export interface BehavioralDescriptors {
  title: string;
  introduction: string;
  firstColumnWords: string[];
  secondColumnWords: string[];
  thirdColumnWords: string[];
}

export interface BehavioralProfileChart {
  naturalChartImage: null;
  roleChartImage: null;
  title: string;
  naturalPBehaviorTitle: string;
  roleBehaviorTitle: string;
  naturalDecisionMakingChartImage: null;
  roleDecisionMakingChartImage: null;
  naturalProfileIntensityChartImage: null;
  roleProfileIntensityChartImage: null;
  naturalEnergyChartImage: null;
  roleEnergyChartImage: null;
  energyBalanceChartImage: null;
  profileModificationChartImage: null;
  formTimeChartImage: null;
  behavioralProfileChartInformation: BehavioralProfileChartInformation;
}

export interface BehavioralProfileChartInformation {
  naturalAverage: number;
  roleAverage: number;
  naturalEnergyChartValue: number;
  naturalRiskChartValue: number;
  naturalExtroversionChartValue: number;
  naturalPatienceChartValue: number;
  naturalConformityNormsChartValue: number;
  naturalSelfControlChartValue: number;
  roleEnergyChartValue: number;
  roleRiskChartValue: number;
  roleExtroversionChartValue: number;
  rolePatienceChartValue: number;
  roleConformityNormsChartValue: number;
  roleSelfControlChartValue: number;
  naturalEnergyIsIntense: boolean;
  naturalRiskIsIntense: boolean;
  naturalExtroversionIsIntense: boolean;
  naturalPatienceIsIntense: boolean;
  naturalConformityNormsIsIntense: boolean;
  naturalSelfControlIsIntense: boolean;
  roleEnergyIsIntense: boolean;
  roleRiskIsIntense: boolean;
  roleExtroversionIsIntense: boolean;
  rolePatienceIsIntense: boolean;
  roleConformityNormsIsIntense: boolean;
  roleSelfControlIsIntense: boolean;
  naturalRiskAxisValue: number;
  naturalExtroversionAxisValue: number;
  naturalPatienceAxisValue: number;
  naturalConformityNormsAxisValue: number;
  naturalSelfControlAxisValue: number;
  roleRiskAxisValue: number;
  roleExtroversionAxisValue: number;
  rolePatienceAxisValue: number;
  roleConformityNormsAxisValue: number;
  roleSelfControlAxisValue: number;
  naturalRiskWordsNumber: number;
  naturalExtroversionWordsNumber: number;
  naturalPatienceWordsNumber: number;
  naturalConformityNormsWordsNumber: number;
  naturalSelfControlWordsNumber: number;
  roleRiskWordsNumber: number;
  roleExtroversionWordsNumber: number;
  rolePatienceWordsNumber: number;
  roleConformityNormsWordsNumber: number;
  roleSelfControlWordsNumber: number;
  naturalRiskAxisIntensity: number;
  naturalExtroversionAxisIntensity: number;
  naturalPatienceAxisIntensity: number;
  naturalConformityNormsAxisIntensity: number;
  naturalSelfControlAxisIntensity: number;
  roleRiskAxisIntensity: number;
  roleExtroversionAxisIntensity: number;
  rolePatienceAxisIntensity: number;
  roleConformityNormsAxisIntensity: number;
  roleSelfControlAxisIntensity: number;
  naturalEnergy: number;
  naturalDecisionMaking: number;
  naturalProfileIntensity: number;
  roleEnergy: number;
  roleDecisionMaking: number;
  roleProfileIntensity: number;
  energyBalance: number;
  profileModification: number;
  duration: number;
}

export interface BehavioralProfileDescription {
  title: string;
  introduction: string;
  description: string;
}

export interface BehavioralRadarChart {
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

export interface BehavioralTrend {
  title: string;
  introduction: string;
  leftSideDescriptionWord: string;
  rightSideDescriptionWord: string;
  footer: string;
  behavioralTrendsDetails?: BehavioralTrendsDetail[];
}

export interface CompetencyCompatibility {
  title: string;
  introduction: string;
  leftSideDescriptionWord: string;
  rightSideDescriptionWord: string;
  footer: string;
  competencyCompatibilityDetail?: CompetencyCompatibilityDetail[];
}

export interface BehavioralTrendsDetail {
  name: string;
  description: string;
  image: null;
  compatibilityPercentage: number;
}

export interface CompetencyCompatibilityDetail {
  competency: string;
  individual: null;
  compatibilityPercentage: number | null;
  image: null;
  description: string;
}

export interface ConsistencyIndicator {
  title: string;
  description: string;
  footer: string;
  image: null;
  consistencyValue: number;
}

export interface CoverIndividual {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  assessmentDate: Date;
  birthdayDate: Date;
  profile: string;
}

export interface CurrentSituation {
  title: string;
  introduction: string;
  description: string;
  footer: string;
  currentSituationDetails: Introduction[];
}

export interface Introduction {
  title: string;
  description: string;
}

export interface DevelopmentPlan {
  title: string;
  introduction: string;
  firstContent: string;
}

export interface HRFeedback {
  title: string;
  introduction: string;
  firstContent: string;
}

export interface EffectiveLeadership {
  title: string;
  introduction: string;
  description: string[];
}

export interface StrengthsOverused {
  title: string;
  introduction: string;
  description: string[];
}

export interface EmotionalIntelligence {
  detail: string;
}

export interface JobCompatibility {
  jobCompatibilityDetailed: JobCompatibilityDetailed;
  multipleJobCompatibility: MultipleJobCompatibility[];
}

export interface MultipleJobCompatibility {
  jobTitle: string;
  compatibilityPercentage: number;
  image: null;
  individualName: string;
}

export interface ManagementStyle {
  title: string;
  subtitle: null;
  introduction: string;
  leadershipTitle: string;
  decisionMakingTitle: string;
  communicationTitle: string;
  decisionMakingDescriptions: string[];
  leadershipDescriptions: string[];
  communicationDescriptions: string[];
}

export interface PDAChart {
  title: string;
  description: string;
  image: null;
  leftSideDescriptionWord: string;
  rightSideDescriptionWord: string;
  axisValue: number;
  isIntense: boolean;
  axis: string;
}

export interface RadarChart {
  naturalRadarChartImage: null;
  roleRadarChartImage: null;
  radarTitle: string;
  radarChartIndividualLegend: string;
  radarChartJobLegend: string;
  content: Content[];
}

export interface Content {
  id: number;
  title: string;
  jobValue: number;
  naturalValue: number;
  roleValue: number;
}

export interface SalesStyle {
  title: string;
  introduction: string;
  openingTitle: string;
  closingTitle: string;
  customerServiceTitle: string;
  openingDescriptions: string[];
  closingDescriptions: string[];
  customerServiceDescriptions: string[];
}

export interface WheelChart {
  title: string;
  graphImage: null;
  content: Content[];
}

export interface JobCompatibilityDetailed {
  jobTitle: string;
  jobDescription: string;
  compatibility: number;
  compatibilityDescription: string;
  jobCompatibilityDetailedAxis: JobCompatibilityDetailedAxi[];
  correlationJobBehavioralCompetencies: CorrelationJobBehavioralCompetency[];
}

export interface JobCompatibilityDetailedAxi {
  axis: string;
  jobValue: number;
  individualValue: number;
  description: string;
  isIntense: boolean;
  individualName: string;
  jobName: string;
}

export interface BehavioralProfileImage {
  title: string;
  introduction: string;
  resourceUrl: string;
}

export interface BehavioralProfileNaturalBrief {
  title: string;
  introduction: string;
  firstContent: string;
}

export interface DevelopmentTips {
  title: string;
  introduction: string;
  firstContent: string;
  secondContent: string;
}

export interface CorrelationJobBehavioralCompetency {
  axiNumber: number;
  competencyId: string;
  competencyName: string;
  description: string;
  natural: number;
  role: number;
}
