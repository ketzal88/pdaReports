/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { initBase } from '../utils/mock.util';
import { LowdbService } from '../../lowdb/lowdb.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtTokenService: JwtService,
    private lowdbService: LowdbService
  ) {}

  async loginWithCredentials() {
    try {
      await initBase(this.lowdbService, './src/modules/auth-mock/json/auth-user.json')
          const authUser = await this.lowdbService.findAll('auth-user');
  
          const { exp, ...restDataUser} = authUser;
  
          const payload = {
            ...restDataUser,
            exp: ((new Date()).getTime() + 86400000) / 1000
          }
  
  
      return {
        token: this.jwtTokenService.sign(payload),
      };
      
    } catch (error) {
      console.log('loginWithCredentials - error: ', error);
    }

  }
}
