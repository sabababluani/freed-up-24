import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionRepository } from './transactions.repository';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  create(createTransactionDto: CreateTransactionDto, id: number) {
    return this.transactionRepository.createTransaction(
      createTransactionDto,
      id,
    );
  }

  createMail(userId: number, amount: number, method: string) {
    return this.transactionRepository.createMail(userId, amount, method);
  }
}
