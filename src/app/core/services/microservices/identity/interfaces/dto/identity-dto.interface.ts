import { UserDetails } from '../../identity.interface';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userDetails: UserDetails;
  expirationMinutes: string;
}

export interface RecoveryPasswordRequest {
  token: string;
  password: string;
}
