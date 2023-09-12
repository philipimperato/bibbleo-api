import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ILoginRequest } from './interfaces/loginRequest';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(data: ILoginRequest): Promise<any> {
    const { email, password } = data;
    const user = await this.usersService._findOne(null, { query: { email } });
    const hash = await bcrypt.hash(password, 10);
    const valid = user && (await bcrypt.compare(password, hash));

    return valid || null;
  }
}
