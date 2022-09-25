/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LowdbService } from '../../lowdb/lowdb.service';
import { JobMockController } from './job-mock.controller';

@Module({
  controllers: [JobMockController],
  providers: [LowdbService],
})
export class JobMockModule {}