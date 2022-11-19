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
          items: ['profileItem', 'consistencySection'],
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
          items: ['competenciesSection'],
        },
      ],
    },
    {
      block: 3,
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
      block: 4,
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
      block: 5,
      sections: [
        {
          column: 1,
          items: ['behavioralProfileChartSection'],
        },
      ],
    },
    {
      block: 6,
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
      block: 7,
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
    {
      block: 8,
      sections: [
        {
          column: 1,
          items: ['certifications'],
        },
      ],
    },
  ],
};
