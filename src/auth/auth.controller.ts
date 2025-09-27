import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Roles } from './guard/jwt-roles.guard';
import { Public } from './guard/jwt-strategy';
import { loginUserDto } from './dto/login-user.dto';
import { Role } from './guard/enum/role.enum';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Public()
  @Post('login')
  loginUser(@Body() body: loginUserDto) {
    return this.authService.login(body);
  }

  @Roles(Role.ADMIN)
  @Public()
  @Post('login/admin')
  async loginAdmin(@Body() createUserDto: loginUserDto) {
    return this.authService.loginAdmin(createUserDto);
  }
}
