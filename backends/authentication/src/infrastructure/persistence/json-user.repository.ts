import { User } from '../../domain/entities/user';
import { UserRepository } from '../../domain/repositories/user.repository';
import { JsonDatasetReader } from './json-dataset-reader';

export class JsonUserRepository implements UserRepository {
  private readonly users: User[];

  constructor(reader = new JsonDatasetReader()) {
    this.users = reader.read<User>('users.json');
  }

  findByUsername(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }
}
