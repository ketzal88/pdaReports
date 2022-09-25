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
import { AuthService } from '../auth-mock/auth.service';
  import { initBase } from '../utils/mock.util';
  
  @Controller('api/identity/v1')
  export class IdentityMockController {
    constructor(private readonly lowdbService: LowdbService, private authService: AuthService) {
      
    }
  
    @Post('/Users/Login')
    async postLogin(
      @Headers() headers,
      @Req() req: Request,
      @Res() res: Response,
    ) {

      try {
        
        await initBase(this.lowdbService, './src/modules/login-mock/json/user-login.json');
        const user = await this.lowdbService.findAll('user');

        const newToken = await this.authService.loginWithCredentials();
        
        const { token, ...restUser} = user;

        return res.status(HttpStatus.OK).json({
          ...restUser,
          token: newToken.token
        })

      } catch (error) {
        console.log('postLogin - error: ', error);
      }

    }

    @Get('/UserAccounts/GetByUserId/:id')
    async getUserById( @Headers() Headers, @Req() req: Request, @Param('id') id, @Res() res: Response){
      try {
        await initBase(this.lowdbService, './src/modules/login-mock/json/user-account.json');
        const userAccount = await this.lowdbService.findAll('user-account');

        return res.status(HttpStatus.OK).json(userAccount);
        
      } catch (error) {
        console.log('getUserById - error: ', error);

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
  
        await initBase(this.lowdbService, './src/modules/individuals-pda-mock/json/individuals.json')
  
        const individuals = await this.lowdbService.findAll('individuals');
  
        return res.status(HttpStatus.OK).json(individuals)
      } catch (error) {
        console.log('getIndividualsWithBehaviouralProfile - error: ', error);
      }
    }
  }
  