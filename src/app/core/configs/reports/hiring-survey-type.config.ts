import { ConfigurationTypesReports } from '../report-type.config';
export const HIRING_SURVEY_TYPE: ConfigurationTypesReports = {
  groupReport: 'HIRING',
  reportType: 'HIRING_SURVEY',
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
          items: ['jobCompatibilityIndividualAreaSection'],
        },
        {
          column: 2,
          items: ['jobCompatibilityMultipleColumnsSection'],
        },
      ],
    },
    {
      block: 3,
      sections: [
        {
          column: 1,
          items: ['behavioralTrend', 'ageGenderBalance'],
        },
        {
          column: 2,
          items: ['behavioralGraph'],
        },
      ],
    },
    {
      block: 4,
      sections: [
        {
          column: 1,
          items: ['behavioralProfileChartSection'],
        },
      ],
    },
    {
      block: 5,
      sections: [
        {
          column: 1,
          items: ['imageProfileType', 'selfDescription'],
        },
        {
          column: 2,
          items: [
            'behavioralProfileDescriptionSection',
            'emotionalInteligenceSection',
          ],
        },
      ],
    },
    {
      block: 6,
      sections: [
        {
          column: 1,
          items: ['potentialDeployment', 'communicationStyle'],
        },
        {
          column: 2,
          items: ['strengthsOverusedSection', 'howToLeadIndividual'],
        },
      ],
    },
  ],
};
