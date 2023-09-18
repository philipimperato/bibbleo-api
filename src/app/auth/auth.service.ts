import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from './../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService._findOne({ query: { email } });

    if (!user) return null;

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return null;

    const userSession = {
      userId: user[this.usersService.PK],
      email: user.email,
    };

    return userSession as Partial<User>;
  }

  async login(user: Partial<User>) {
    const { userId, email } = user;
    const tokens = await this.getTokens(userId, email);
    const hashedToken = await bcrypt.hash(tokens.refreshToken, 10);

    await this.usersService.update(userId, {
      refreshToken: hashedToken,
    });

    return { userId, email, ...tokens };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService._get(userId);

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Session has expired');

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches)
      throw new ForbiddenException('Session has expired');

    const tokens = await this.getTokens(user.userId, user.email);
    const hashedToken = await bcrypt.hash(tokens.refreshToken, 10);

    await this.usersService.update(userId, {
      refreshToken: hashedToken,
    });

    return tokens;
  }

  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
