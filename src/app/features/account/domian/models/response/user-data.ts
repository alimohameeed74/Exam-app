export interface UserData {
  token: string;
  user: {
    email: string;
    username: string;
    role: 'ADMIN' | 'USER';
    fName: string;
    lName: string;
  };
}
