import { ConfigurationTypesReports } from '../report-type.config';
export const DEVELOPMENT_CANDIDATE_REVIEW: ConfigurationTypesReports = {
  groupReport: 'DEVELOPMENT',
  reportType: 'DEVELOPMENT_CANDIDATE_REVIEW',
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
          items: ['videoSection'],
        },
      ],
    },
    {
      block: 2,
      sections: [
        {
          column: 1,
          items: ['imageFullProfileType'],
        },
      ],
    },
    {
      block: 3,
      sections: [
        {
          column: 1,
          items: ['behavioralProfileChartSection'],
        },
      ],
    },
    {
      block: 4,
      sections: [
        {
          column: 1,
          items: ['competenciesSection'],
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
          items: ['currentSituation', 'potentialDeployment'],
        },
        {
          column: 2,
          items: ['strengthsOverusedSection', 'hrFeedback'],
        },
      ],
    },
    {
      block: 6,
      sections: [
        {
          column: 1,
          items: ['certifications'],
        },
      ],
    },
    {
      block: 7,
      sections: [
        {
          column: 1,
          items: ['shareYourProfileInTheRRSS'],
        },
      ],
    },
  ],
};
