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

@Controller('api/competency/v1')
export class CompetencyMockController {
  constructor(private readonly lowdbService: LowdbService) {}

  @Get('/CompetencyCategories')
  async getCompetencyCategories(
    @Headers() headers,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await initBase(
        this.lowdbService,
        './src/modules/competency-mock/json/competency-categories.json',
      );
      const competencyCategories = await this.lowdbService.findAll(
        'competency-categories',
      );
      return res.status(HttpStatus.OK).json(competencyCategories);
    } catch (error) {
      console.log('getCompetencyCategories - error: ', error);
    }
  }

  @Get('/Competencies')
  async getCompetencies(
    @Headers() headers,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await initBase(
        this.lowdbService,
        './src/modules/competency-mock/json/competencies.json',
      );
      const competencyCategories = await this.lowdbService.findAll(
        'competencies',
      );
      return res.status(HttpStatus.OK).json(competencyCategories);
    } catch (error) {
      console.log('getCompetencies - error: ', error);
    }
  }
}
