import { LoggedUser } from './logged-user.js';

export interface Login {
  user: LoggedUser;
  token: string;
}
