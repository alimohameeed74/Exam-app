export interface LoggedUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}
