import { Role } from 'src/auth/guard/enum/role.enum';
import { BaseEntity } from 'src/common/base.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: string;

  @Column({ nullable: true, default: 'Одобренный' })
  status: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: '0' })
  money: string;

  @Column({ default: 'USD' })
  currency: string;

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    eager: true,
  })
  transactions: Transaction[];
}
