/* eslint-disable prettier/prettier */
import { Controller, Post, Req, Res, Headers, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { LowdbService } from '../../lowdb/lowdb.service';
import { initBase } from '../utils/mock.util';

@Controller('api/Files')
export class FileMockController {
  constructor(private readonly lowdbService: LowdbService) {}

  @Post('')
  async saveImage(
    @Headers() headers,
    @Req() req: Request,
    @Res() res: Response,
  ) {
      try {
        await initBase(this.lowdbService, './src/modules/file-mock/json/files.json')
        const image = await this.lowdbService.findAll('files');
        return res.status(HttpStatus.OK).json(image.path)
      } catch (error) {
          console.log('saveImage - error: ', error);
      }
  }
}
