import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import IsTruthyOnDefined from '../../../validation/is-truthy-on-defined';
import { IsIn } from 'class-validator';

export class UpdateUserDto extends PickType(CreateUserDto, [
  'email',
  'firstname',
  'lastname',
  'refreshToken',
] as const) {
  @IsTruthyOnDefined()
  email: string;

  @IsTruthyOnDefined()
  firstname: string;

  @IsTruthyOnDefined()
  lastname: string;

  @IsTruthyOnDefined()
  refreshToken: string;

  @IsIn(['new', 'active', 'inactive', 'archived'])
  status: string;

  @IsTruthyOnDefined()
  password: string;
}
