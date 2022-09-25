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
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { LowdbService } from '../../lowdb/lowdb.service';
  import { initBase } from '../utils/mock.util';
  import { v4 as uuidv4 } from 'uuid';
  
  @Controller('api/report/v1')
  export class ReportMockController {
    constructor(private readonly lowdbService: LowdbService) {
      
    }

    @Get('/Reports')
    async getReports( 
      @Headers() headers,
      @Req() req: Request,
      @Res() res: Response){
      try {
        await initBase(this.lowdbService, './src/modules/report-mock/json/reports.json')
        const reports = await this.lowdbService.findAll('reports');
        const reportId = <string>req.query.ReportId;
        const selectedReport = reports;
        //Comparo por ids de tipos de reportes
        if([
          '01e3cef3-8b17-4922-8695-6f768267dba2', 
          '9f77baec-810d-43c4-a63a-d05fbe717020', 
          'd488562c-811b-4bf6-9e58-3e6d8b98817d',
          'cabd00fb-4c22-4ccf-9eca-6265f2eaf013',
          '9cdc5ba7-54f8-4cc7-b12a-04f7a5d66621'].includes(reportId)){
          selectedReport.data = reports.data.filter(data=> data.reportId === reportId)
          return res.status(HttpStatus.OK).json(selectedReport)
        }else{
          return res.status(HttpStatus.OK).json(reports)
        }

      } catch (error) {
        console.log('getReports - error: ', error);
      }
    }

    @Get('/ReportTypes')
    async getReportTypes( 
      @Headers() headers,
      @Req() req: Request,
      @Res() res: Response){
      try {
        await initBase(this.lowdbService, './src/modules/report-mock/json/report-types.json')
        const reportTypes = await this.lowdbService.findAll('report-types');
        return res.status(HttpStatus.OK).json(reportTypes)

      } catch (error) {
        console.log('getReportTypes - error: ', error);

      }
    }

    @Get('/ReportGenerated/:shortId')
    async getReportGeneratedById(
      @Headers() headers,
      @Req() req: Request,
      @Res() res: Response){
        try {
          console.log('shortId: ', req.params.shortId)
          await initBase(this.lowdbService, './src/modules/report-mock/json/generated-report.json')
          const generatedReport = await this.lowdbService.findAll('generated-report');
          const selectedShortId = <string>req.params.shortId;
          const {shortId,...restReport} = generatedReport.find(data=> data.shortId === selectedShortId)
          return res.status(HttpStatus.OK).json(restReport)
        } catch (error) {
          console.log('getReportGeneratedById - error: ', error);
        }
    }

    @Get('/ReportGenerated')
    async getReportGenerated(
      @Headers() headers,
      @Req() req: Request,
      @Res() res: Response){
        try {
          await initBase(this.lowdbService, './src/modules/report-mock/json/generated-reports.json')
          const generatedReports = await this.lowdbService.findAll('generated-reports');
          return res.status(HttpStatus.OK).json(generatedReports)
        } catch (error) {
          console.log('getReportGenerated - error: ', error);
        }
    }

    @Post('/ReportGenerated')
    async generatedReport(
      @Headers() headers,
      @Req() req: Request,
      @Res() res: Response){
        try {
          const uuid = uuidv4();
        return res.status(HttpStatus.OK).json(uuid);
        } catch (error) {
          console.log('generatedReport - error: ', error);
        }
    }

    @Post('/ReportGenerated/:id/Competency')
    async generatedCompetencyByReport(
      @Headers() headers,
      @Req() req: Request,
      @Res() res: Response){
        try {
        return res.status(HttpStatus.OK).json(true);
        } catch (error) {
          console.log('generatedCompetencyByReport - error: ', error);
        }
    }

    @Post('/ReportGenerated/:id/Job')
    async generatedJobByReport(
      @Headers() headers,
      @Req() req: Request,
      @Res() res: Response){
        try {
        return res.status(HttpStatus.OK).json(true);
        } catch (error) {
          console.log('generatedJobByReport - error: ', error);
        }
    }
  
    // Carga de individuals profile
    @Post('/ReportGeneration/PDAIndividualSections')
    async loadReports(
      @Headers() headers,
      @Req() req: Request,
      @Res() res: Response,
    ) {

      try {
        
        await initBase(this.lowdbService, './src/modules/report-mock/json/individual-sections.json')
        const individualSections = await this.lowdbService.findAll('individual-sections');

        return res.status(HttpStatus.OK).json(individualSections)

      } catch (error) {
        console.log('loadReports - error: ', error);
      }

    }
  
    // Get data individuals profile
    @Get('/GetAllIndividualWithBehaviouralProfile')
    async getIndividualsWithBehaviouralProfile(
      @Headers() headers,
      @Req() req: Request,
      @Res() res: Response,
    ) {
      try {
  
        await initBase(this.lowdbService, './src/modules/report-mock/json/individuals.json')
  
        const individuals = await this.lowdbService.findAll('individuals');
  
        return res.status(HttpStatus.OK).json(individuals)
      } catch (error) {
        console.log('error: ', error);
      }
    }
  }
  