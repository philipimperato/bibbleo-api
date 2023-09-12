import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import IsTruthyOnDefined from '../../../validation/is-truthy-on-defined';

export class UpdateUserDto extends PickType(CreateUserDto, [
  'email',
  'firstname',
  'lastname',
] as const) {
  @IsTruthyOnDefined()
  email: string;

  @IsTruthyOnDefined()
  firstname: string;

  @IsTruthyOnDefined()
  lastname: string;

  @IsTruthyOnDefined()
  age: number;
}
