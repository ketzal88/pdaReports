export interface Token {
  //BaseId: string;
  //SubbaseId: string;
  UserId: string;
  alg: string;
  aud: string;
  exp: number;
  fullName: string;
  iss: string;
  typ: string;
  UserAllowAdministration: string;
  CreditsAllowAdd: string;
  ClientAllowCreate: string;
  ClientAllowEdit: string;
  RoleAllowAdministration: string;
  role: string[];
}
