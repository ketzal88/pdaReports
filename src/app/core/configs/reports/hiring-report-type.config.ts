import { ConfigurationTypesReports } from '../report-type.config';
export const HIRING_REPORT_TYPE: ConfigurationTypesReports = {
  groupReport: 'HIRING',
  reportType: 'HIRING_REPORT',
  screens: [
    {
      block: 1,
      sections: [
        {
          column: 1,
          items: ['profileItem', 'discoverYourUniqueness'],
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
          items: ['imageProfileType'],
        },
        {
          column: 2,
          items: ['expandedBehavioralProfile'],
        },
      ],
    },
    {
      block: 6,
      sections: [
        {
          column: 1,
          items: ['competenciesSection'],
        },
        {
          column: 2,
          items: ['emotionalInteligenceSection', 'communicationStyle'],
        },
      ],
    },
    {
      block: 7,
      sections: [
        {
          column: 1,
          items: ['howToLeadIndividual', 'potentialDeployment'],
        },
        {
          column: 2,
          items: ['strengthsOverusedSection'],
        },
      ],
    },
  ],
};
