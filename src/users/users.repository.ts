import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, surname, email, phone, password, currency } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User();
    newUser.name = name;
    newUser.surname = surname;
    newUser.password = hashedPassword;
    newUser.email = email;
    newUser.phone = phone;
    newUser.currency = currency || 'USD';

    this.usersRepository.save(newUser);

    return 'User Successfully Registered';
  }

  async me(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new Error('User not found');

    const now = new Date();

    if (!user.lastProfitUpdate) {
      user.profit = +(user.money * 0.004).toFixed(2);
      user.income = +(user.money * 0.025).toFixed(2);
      user.loss = +(user.money * 0.05).toFixed(2);

      user.profit *= 2;
      user.income *= 2;
      user.loss *= 2;

      user.lastProfitUpdate = now;
    } else {
      const diffInMs =
        now.getTime() - new Date(user.lastProfitUpdate).getTime();
      const weeksPassed = Math.floor(diffInMs / (7 * 24 * 60 * 60 * 1000));

      if (weeksPassed > 0) {
        user.profit *= 2 ** weeksPassed;
        user.income *= 2 ** weeksPassed;
        user.loss *= 2 ** weeksPassed;

        user.lastProfitUpdate = now;
      }
    }

    await this.usersRepository.save(user);
    return user;
  }

  async findOneByEmail(email: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async delete(id: number) {
    const result = await this.usersRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { message: `User with ID ${id} successfully deleted` };
  }
}
