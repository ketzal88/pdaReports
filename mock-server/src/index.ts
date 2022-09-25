/* eslint-disable prettier/prettier */
import { ReportMockModule } from './modules/report-mock/report-mock.module';
import { IndividualsPdaMockModule } from './modules/individuals-pda-mock/individuals-pda-mock.module';
import { LoginMockModule } from './modules/login-mock/login-mock.module';
import { ClientMockModule } from './modules/client-mock/client-mock.module';
import { FileMockModule } from './modules/file-mock/file-mock.module';
import { CompetencyMockModule } from './modules/competency-mock/competency-mock.module';
import { JobMockModule } from './modules/job-mock/job-mock.module';

export const moduleMocks = [
    IndividualsPdaMockModule, 
    ReportMockModule, 
    LoginMockModule, 
    ClientMockModule, 
    FileMockModule,
    CompetencyMockModule,
    JobMockModule
];
