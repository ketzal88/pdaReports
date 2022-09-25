/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
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
  Patch,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LowdbService } from '../../lowdb/lowdb.service';
import { initBase } from '../utils/mock.util';
import { v4 as uuidv4 } from 'uuid';

@Controller('api/individual/v1')
export class IndividualsPdaMockController {
  constructor(private readonly lowdbService: LowdbService) {
    
  }

  // Carga de individuals profile
  @Post('/individuals')
  async cargaTransferenciaIndividual(
    @Headers() headers,
    @Req() req: Request,
    @Res() res: Response,
  ) {}

  @Get('/Gender/GetGenderLanguage')
  async getGenderLanguage(
    @Headers() headers,
    @Req() req: Request,
    @Res() res: Response){
      try {
        await initBase(this.lowdbService, './src/modules/individuals-pda-mock/json/gender-language.json')
        const genderLanguageList = await this.lowdbService.findAll('gender-language');
        return res.status(HttpStatus.OK).json(genderLanguageList)

      } catch (error) {
        console.log('getGenderLanguage - error: ', error)
      }
  }

  @Get('/Area')
  async getArea(
    @Headers() headers,
    @Req() req: Request,
    @Res() res: Response){
      try {
        await initBase(this.lowdbService, './src/modules/individuals-pda-mock/json/area.json')
        const areaList = await this.lowdbService.findAll('area');
        return res.status(HttpStatus.OK).json(areaList)

      } catch (error) {
        console.log('getArea - error: ', error)
      }
  }

  @Patch('/Area/:id')
  async updateArea(
    @Headers() headers,
    @Req() req: Request,
    @Res() res: Response){
      try {
        const uuid = uuidv4();
        return res.status(HttpStatus.OK).json(uuid);

      } catch (error) {
        console.log('updateArea - error: ', error)
      }
  }

  @Post('/Area')
  async createArea(
    @Headers() headers,
    @Req() req: Request,
    @Res() res: Response){
      try {
        const uuid = uuidv4();
        return res.status(HttpStatus.CREATED).json(uuid);

      } catch (error) {
        console.log('createArea - error: ', error)
      }
  }

  @Delete('/Area/:id')
  async deleteArea(
    @Headers() headers,
    @Req() req: Request,
    @Res() res: Response){
      try {
        const uuid = uuidv4();
        return res.status(HttpStatus.OK).json(uuid);

      } catch (error) {
        console.log('deleteArea - error: ', error)
      }
  }

  @Get('/Grouping')
  async getGrouping(
    @Headers() headers,
    @Req() req: Request,
    @Res() res: Response){
      try {
        await initBase(this.lowdbService, './src/modules/individuals-pda-mock/json/grouping.json')
        const groupingList = await this.lowdbService.findAll('grouping');
        return res.status(HttpStatus.OK).json(groupingList)

      } catch (error) {
        console.log('getGrouping - error: ', error)
      }
  }
  
  @Post('/Grouping')
  async createGrouping(
    @Headers() headers,
    @Req() req: Request,
    @Res() res: Response){
      try {
        const uuid = uuidv4();
        return res.status(HttpStatus.CREATED).json(uuid);

      } catch (error) {
        console.log('createGrouping - error: ', error)
      }
  }

  @Patch('/Grouping/:id')
  async updateGrouping(
    @Headers() headers,
    @Req() req: Request,
    @Res() res: Response){
      try {
        const uuid = uuidv4();
        return res.status(HttpStatus.OK).json(uuid);

      } catch (error) {
        console.log('updateGrouping - error: ', error)
      }
  }

  @Delete('/Grouping/:id')
  async deleteGrouping(
    @Headers() headers,
    @Req() req: Request,
    @Res() res: Response){
      try {
        const uuid = uuidv4();
        return res.status(HttpStatus.OK).json(uuid);

      } catch (error) {
        console.log('deleteGrouping - error: ', error)
      }
  }

  // Get data individuals profile
  @Get('/Individuals/GetAllIndividualWithBehaviouralProfile')
  async getIndividualsWithBehaviouralProfile(
    @Headers() headers,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {

      await initBase(this.lowdbService, './src/modules/individuals-pda-mock/json/individuals.json')

      const individuals = await this.lowdbService.findAll('individuals');

      return res.status(HttpStatus.OK).json(individuals)
    } catch (error) {
      console.log('error: ', error);
    }
  }


}
