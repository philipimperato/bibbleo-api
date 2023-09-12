import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export default class FindAllQuery {
  @IsInt()
  @Type(() => Number)
  $limit: number = 10;

  @IsInt()
  @Type(() => Number)
  $skip: number = 1;
}
