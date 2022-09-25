/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LowdbService } from '../../lowdb/lowdb.service';
import { IndividualsPdaMockController } from './individuals-pda-mock.controller';

@Module({
  controllers: [IndividualsPdaMockController],
  providers: [LowdbService],
})
export class IndividualsPdaMockModule {}
