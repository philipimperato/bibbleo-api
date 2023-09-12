import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import FindOneResponse from '../interfaces/find-one-response';

@Injectable()
export class FindOneInterceptor<T>
  implements NestInterceptor<T, FindOneResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<FindOneResponse<T>> {
    return next.handle().pipe(map((result) => ({ data: result })));
  }
}
