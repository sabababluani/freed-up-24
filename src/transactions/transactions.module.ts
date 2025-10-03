import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { TransactionRepository } from './transactions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User])],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionRepository],
  exports: [TransactionRepository],
})
export class TransactionsModule {}
