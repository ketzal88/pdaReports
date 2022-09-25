/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LowdbService } from '../../lowdb/lowdb.service';
import { ClientMockController } from './client-mock.controller';

@Module({
  controllers: [ClientMockController],
  providers: [LowdbService],
})
export class ClientMockModule {}
