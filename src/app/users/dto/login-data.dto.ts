import { IsDefined, IsEmail } from 'class-validator';

export class LoginData {
  @IsEmail(undefined, { message: 'Invalid email' })
  email: string;

  @IsDefined()
  password: string;
}
