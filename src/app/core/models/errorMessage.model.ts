import { DislayType } from 'src/app/shared/components/display-message/displayMessage.interface';

export interface ErrorMessage {
  title: string;
  description: string;
  type: DislayType;
  action: ErrorAction;
}

export enum ErrorAction {
  NONE = 'None',
  LOGOUT = 'LogOut',
}
