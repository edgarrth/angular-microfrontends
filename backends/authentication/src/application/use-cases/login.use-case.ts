import { createHash, randomUUID } from 'node:crypto';
import { z } from 'zod';
import { AuthenticatedUser } from '../../domain/entities/user';
import { UserRepository } from '../../domain/repositories/user.repository';

export const LoginCommand = z.object({ username: z.string().min(1), password: z.string().min(1) });
export type LoginCommand = z.infer<typeof LoginCommand>;

export class LoginUseCase {
  constructor(private readonly users: UserRepository) {}

  execute(command: LoginCommand): AuthenticatedUser {
    const credentials = LoginCommand.parse(command);
    const user = this.users.findByUsername(credentials.username);

    if (!user || user.password !== credentials.password) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const tokenSeed = `${user.id}:${randomUUID()}:${Date.now()}`;
    return {
      accessToken: createHash('sha256').update(tokenSeed).digest('hex'),
      user: { id: user.id, username: user.username, displayName: user.displayName, roles: user.roles },
    };
  }
}
