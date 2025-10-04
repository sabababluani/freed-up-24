import { IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  title: string;

  @IsString()
  transactionMoney: string;
}
