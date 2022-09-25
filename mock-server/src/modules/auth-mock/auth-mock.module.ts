/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { LowdbService } from '../../lowdb/lowdb.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      
    }),
  ],
  providers: [AuthService, LowdbService],
  exports: [AuthService],
})
export class AuthMockModule {}
