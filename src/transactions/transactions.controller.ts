import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard)
  @Post('/mail')
  createMail(
    @Req() req: any,
    @Body('amount') amount: number,
    @Body('method') method: string,
  ) {
    return this.transactionsService.createMail(req.user.id, amount, method);
  }

  @UseGuards(AuthGuard)
  @Post(':id')
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Param('id') id: string,
  ) {
    return this.transactionsService.create(createTransactionDto, +id);
  }
}
