import { PaginatedResponse } from '../paginatedResponse.interface';
export interface UserDetails {
  userId: string;
  userName: string;
  userRoles?: UserRoleElement[];
  userClaims?: Claim[];
  usersAccounts: UsersAccount[];
}

export interface Claim {
  id: number;
  userId?: string;
  claimType: string;
  claimValue: string;
  roleId?: string;
}

export interface UserRoleElement {
  userRole: UserRoleUserRole;
  roleClaims: Claim[];
}

export interface UserRoleUserRole {
  roleId: string;
  userId: string;
  roleName: string;
}

export interface UserAccountPaginated extends PaginatedResponse<UsersAccount> {}

export interface UsersAccount {
  userAccountId: string;
  userId: string;
  accountId: string;
  active: boolean;
  lastActivityDate: string;
  account: Account;
  user: User;
  base: Base;
}

export interface Account {
  id: string;
  baseId: string;
  sendMailPDAComplete: boolean;
  sendMailPDACompleteEmail: null | string;
  active: boolean;
  creationDate: string;
  modificationDate: string;
  deletionDate: null;
  languageId: string;
  allowEditionJob: null;
  passwordReset: boolean;
  skin: null | string;
  email: string;
  multicliente: boolean;
  multiregion: boolean;
}

export interface Base {
  baseId: string;
  subBaseId: string;
  subBaseName: string;
  link: string;
  userAccountId: string;
  userId: string;
  accountId: string;
  active: boolean;
  lastActivityDate: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  lastLoginDate: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: string;
  securityStamp: null;
  concurrencyStamp: string;
  phoneNumber: null;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: null;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}
