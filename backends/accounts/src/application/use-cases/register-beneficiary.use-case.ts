import { z } from 'zod';
import { AccountRepository } from '../../domain/repositories/account.repository';

export const RegisterBeneficiaryCommand = z.object({
  alias: z.string().min(3),
  bankName: z.string().min(2),
  accountNumber: z.string().min(6),
  currency: z.enum(['USD', 'PEN']),
});

export type RegisterBeneficiaryCommand = z.infer<typeof RegisterBeneficiaryCommand>;

export class RegisterBeneficiaryUseCase {
  constructor(private readonly accounts: AccountRepository) {}

  execute(command: RegisterBeneficiaryCommand) {
    return this.accounts.saveBeneficiary(RegisterBeneficiaryCommand.parse(command));
  }
}
