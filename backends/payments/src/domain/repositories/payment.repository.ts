import { Payment } from '../entities/payment';

export interface PaymentRepository {
  findAll(): Payment[];
  findById(id: string): Payment | undefined;
  save(payment: Payment): Payment;
  update(payment: Payment): Payment;
}
