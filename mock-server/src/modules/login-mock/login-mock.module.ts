/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LowdbService } from '../../lowdb/lowdb.service';
import { IdentityMockController } from './login-mock.controller';
import { AuthMockModule } from '../auth-mock/auth-mock.module';

@Module({
  controllers: [IdentityMockController],
  imports: [AuthMockModule],
  providers: [LowdbService],
})
export class LoginMockModule {}
