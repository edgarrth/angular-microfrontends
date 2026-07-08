export interface User {
  id: string;
  username: string;
  password: string;
  displayName: string;
  roles: string[];
}

export interface AuthenticatedUser {
  accessToken: string;
  user: Omit<User, 'password'>;
}
