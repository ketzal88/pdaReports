/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LowdbService } from '../../lowdb/lowdb.service';
import { CompetencyMockController } from './competency-mock.controller';

@Module({
  controllers: [CompetencyMockController],
  providers: [LowdbService],
})
export class CompetencyMockModule {}
