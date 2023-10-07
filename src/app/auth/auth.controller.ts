import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  Get,
  ForbiddenException,
} from '@nestjs/common';
import { Public } from './../../decorators/is-public';
import { LocalAuthGuard } from './../../guards/local.auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.model';
import { RefreshTokenGuard } from './../../guards/refresh-token.guard';
import { SessionRequest } from './session-request.dec';
import { ResetPasswordDto } from './dto/reset-password.dts';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post()
  login(@Req() req): any {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const user = await this.usersService.create({
      ...createUserDto,
      password: await bcrypt.hash(password, 10),
    });
    const { userId, email } = user as Partial<User>;
    const { refreshToken } = await this.authService.getTokens(userId, email);

    await this.usersService.update(userId, { refreshToken });

    return { status: '200', userId, email, refreshToken };
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: SessionRequest) {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;

    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetData: ResetPasswordDto,
    @Req() req: SessionRequest,
  ) {
    const { sub: userId, email } = req.user;
    const { currentPassword, newPassword } = resetData;
    const validUser = await this.authService.validateUser(
      email,
      currentPassword,
    );

    if (!validUser) throw new ForbiddenException('Session has expired');

    const password = await bcrypt.has(newPassword, 10);
    return this.usersService.update(userId, { password });
  }

  @Get('logout')
  logout(@Req() req: SessionRequest) {
    const { sub: userId } = req.user;
    this.authService.logout(userId);
  }
}
