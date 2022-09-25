/* eslint-disable prettier/prettier */
import { Controller, Get, HttpStatus, Req, Res, Headers, Patch,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LowdbService } from '../../lowdb/lowdb.service';
import { initBase } from '../utils/mock.util';
import { v4 as uuidv4 } from 'uuid';


@Controller('api/client/v1')
export class ClientMockController {
  constructor(private readonly lowdbService: LowdbService) {}

    @Get('/Subbase')
    async getSubbase( 
        @Headers() headers,
        @Req() req: Request,
        @Res() res: Response){
      try {
        await initBase(this.lowdbService, './src/modules/client-mock/json/subbase.json')
        const subbase = await this.lowdbService.findAll('subbase');
        return res.status(HttpStatus.OK).json(subbase)

      } catch (error) {
        console.log('getSubbase - error: ', error);
      }
    }

    @Get('/Client/:id')
    async getClient(
        @Headers() headers,
        @Req() req: Request,
        @Res() res: Response){
            try {
                await initBase(this.lowdbService, './src/modules/client-mock/json/client.json')
                const client = await this.lowdbService.findAll('client');
                return res.status(HttpStatus.OK).json(client)
            } catch (error) {
                console.log('getClient - error: ', error);
            }
    }

    @Patch('/Client/:id/ReportLogo')
    async updateLogo(
        @Headers() headers,
        @Req() req: Request,
        @Res() res: Response){
            try {
                const uuid = uuidv4();
                return res.status(HttpStatus.OK).json(uuid);
            } catch (error) {
                console.log('updateLogo - error: ', error)
            }
    }
}
