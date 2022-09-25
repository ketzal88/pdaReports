/* eslint-disable prettier/prettier */
import {
    Controller,
    Post,
    HttpStatus,
    Req,
    Res,
    Get,
    Put,
    Delete,
    Param,
    Headers,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { LowdbService } from '../../lowdb/lowdb.service';
  import { initBase } from '../utils/mock.util';
  
  @Controller('api/job/v1')
  export class JobMockController {
    constructor(private readonly lowdbService: LowdbService) {}
  
    @Get('/JobCategories')
    async getJobCategories(
      @Headers() headers,
      @Req() req: Request,
      @Res() res: Response,
    ) {
      try {
        await initBase(
          this.lowdbService,
          './src/modules/job-mock/json/job-categories.json',
        );
        const competencyCategories = await this.lowdbService.findAll(
          'job-categories',
        );
        return res.status(HttpStatus.OK).json(competencyCategories);
      } catch (error) {
        console.log('getJobCategories - error: ', error);
      }
    }

    @Get('/Jobs')
    async getJobs(
      @Headers() headers,
      @Req() req: Request,
      @Res() res: Response,
    ) {
      try {
        await initBase(
          this.lowdbService,
          './src/modules/job-mock/json/jobs.json',
        );
        const jobs = await this.lowdbService.findAll(
          'jobs',
        );
        return res.status(HttpStatus.OK).json(jobs);
      } catch (error) {
        console.log('getJobs - error: ', error);
      }
    }
}