/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { FileMockController } from "./file-mock.controller";
import { LowdbService } from '../../lowdb/lowdb.service';

@Module({
    controllers: [FileMockController],
    providers: [LowdbService],
  })
export class FileMockModule {}