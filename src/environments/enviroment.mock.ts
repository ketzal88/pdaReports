// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import pkg from 'package.json';

const protocol = 'https://';
const gatewayDomain = 'gatewayDomain';
const frontEndDomain = 'localhost:4200';
const domain = 'domain';
const reportPath = '/app/reports/';

// const path = protocol + gatewayDomain + '.' + domain;
const path = 'http://localhost:3000';

export const environment = {
  pdaPlatformURL: protocol + domain,
  reportURL: 'http://' + frontEndDomain + reportPath,
  production: false,
  cookieDomain: 'localhost',
  anyChart: { licenseKey: 'mylicense' },
  apiIndividual: `${path}/api/individual/v1`,
  apiReports: `${path}/api/report/v1`,
  apiJobs: `${path}/api/job/v1`,
  apiIdentity: `${path}/api/identity/v1`,
  version: pkg.version,
  apiCompetency: `${path}/api/competency/v1`,
  apiFileManager: `${path}`,
  apiEmail: `${path}/api/email/v1`,
  apiClient: `${path}/api/client/v1`,
  pathRole: 'http://cluna.com/role',
  pathPowered: 'http://localhost:3000/pda/images',
  anonymousUser: {
    name: 'usercluna',
    password: 'cluna',
  },
  pathImagesSection: '/assets/img/sections/',
  apiConfiguration: `${path}/api/configuration/v1`,
  disableGrouping: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
