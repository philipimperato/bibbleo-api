import { IsDefined, IsEmail } from 'class-validator';
import IsTruthy from '../../../validation/is-truthy';

export class CreateUserDto {
  @IsEmail(undefined, { message: 'Invalid email' })
  email: string;

  @IsDefined()
  password: string;

  @IsTruthy()
  firstname: string;

  @IsTruthy()
  lastname: string;
}
