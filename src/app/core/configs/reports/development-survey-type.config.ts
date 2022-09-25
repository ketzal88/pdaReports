import { ConfigurationTypesReports } from '../report-type.config';
export const DEVELOPMENT_SURVEY_TYPE: ConfigurationTypesReports = {
  groupReport: 'DEVELOPMENT',
  reportType: 'DEVELOPMENT_SURVEY',
  screens: [
    {
      block: 1,
      sections: [
        {
          column: 1,
          items: ['profileItem', 'consistencySection', 'competenciesSection'],
        },
        {
          column: 2,
          items: ['jobCompatibilitySection'],
        },
      ],
    },
    {
      block: 2,
      sections: [
        {
          column: 1,
          items: ['behavioralProfileChartSection'],
        },
      ],
    },
    {
      block: 3,
      sections: [
        {
          column: 1,
          items: ['imageProfileType', 'selfDescription'],
        },
        {
          column: 2,
          items: ['behavioralProfileDescriptionSection', 'currentSituation'],
        },
      ],
    },
    {
      block: 4,
      sections: [
        {
          column: 1,
          items: ['behavioralTrends'],
        },
        {
          column: 2,
          items: ['behavioralGraph'],
        },
      ],
    },
    {
      block: 5,
      sections: [
        {
          column: 1,
          items: ['developmentPlan', 'emotionalInteligenceSection'],
        },
        {
          column: 2,
          items: ['strengthsOverusedSection', 'potentialDeployment'],
        },
      ],
    },
  ],
};
