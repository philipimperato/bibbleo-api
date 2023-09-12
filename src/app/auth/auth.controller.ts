import { Body, Controller, Post, Req } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Post('login')
  async login(@Req() req, @Body() body) {
    const { email, password } = body;
    const user = await this.usersService._findOne(null, { query: { email } });
    const valid = user && (await bcrypt.compare(password, user.password));
    console.log(valid);

    return req.user;
  }
}
