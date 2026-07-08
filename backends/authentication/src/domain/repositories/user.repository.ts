import { User } from '../entities/user';

export interface UserRepository {
  findByUsername(username: string): User | undefined;
}
