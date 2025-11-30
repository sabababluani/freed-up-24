import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    userId: number,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      user,
    });
    await this.transactionRepository.save(transaction);
    return { message: 'Successfuly created transaction' };
  }

  async createMail(userId: number, amount: number, method: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new Error('User not found');

    await this.mailService.sendOrderSuccessEmail(amount, user.email, method);

    return { message: 'Successfully sent mail' };
  }
}
