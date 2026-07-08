import { Payment } from '../../domain/entities/payment';
import { PaymentRepository } from '../../domain/repositories/payment.repository';
import { JsonDatasetReader } from './json-dataset-reader';

export class JsonPaymentRepository implements PaymentRepository {
  private readonly payments: Payment[];

  constructor(reader = new JsonDatasetReader()) {
    this.payments = reader.read<Payment>('payments.json');
  }

  findAll(): Payment[] {
    return [...this.payments].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  findById(id: string): Payment | undefined {
    return this.payments.find((payment) => payment.id === id);
  }

  save(payment: Payment): Payment {
    this.payments.push(payment);
    return payment;
  }

  update(payment: Payment): Payment {
    const index = this.payments.findIndex((current) => current.id === payment.id);
    if (index >= 0) {
      this.payments[index] = payment;
    }
    return payment;
  }
}
