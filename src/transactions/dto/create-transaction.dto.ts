import { IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  title: string;

  @IsNumber()
  transactionMoney: string;
}
