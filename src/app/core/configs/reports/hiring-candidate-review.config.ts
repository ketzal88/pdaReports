import { ConfigurationTypesReports } from '../report-type.config';
export const HIRING_CANDIDATE_REVIEW: ConfigurationTypesReports = {
  groupReport: 'HIRING',
  reportType: 'HIRING_CANDIDATE_REVIEW',
  screens: [
    {
      block: 1,
      sections: [
        {
          column: 1,
          items: ['imageFullProfileType'],
        },
      ],
    },
    {
      block: 2,
      sections: [
        {
          column: 0,
          items: ['questionBehavioralProfile'],
        },
        {
          column: 1,
          items: ['knowWilliamMarstonTheory'],
        },
        {
          column: 2,
          items: ['emotionalInteligenceSection', 'knowBehavioralProfile'],
        },
      ],
    },
    {
      block: 3,
      sections: [
        {
          column: 0,
          items: ['knowYourKeyCompetencies'],
        },
        {
          column: 1,
          items: ['competenciesSection'],
        },
        {
          column: 2,
          items: ['knowYourProfileComparedSkillsFuture'],
        },
      ],
    },
    {
      block: 4,
      sections: [
        {
          column: 1,
          items: ['hrFeedback', 'knowMoreBehavioralProfile'],
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
          column: 0,
          items: ['exploreYourCVWithTheseTips'],
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
