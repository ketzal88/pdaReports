/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LowdbService } from '../../lowdb/lowdb.service';
import { ReportMockController } from './report-mock.controller';

@Module({
  controllers: [ReportMockController],
  providers: [LowdbService],
})
export class ReportMockModule {}
