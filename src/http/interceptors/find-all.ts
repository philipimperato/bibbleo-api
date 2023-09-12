import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import FindAllResponse from '../interfaces/find-all-response';
import { getPagination } from '../http-helper';

@Injectable()
export class FindAllInterceptor<T>
  implements NestInterceptor<T, FindAllResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<FindAllResponse<T>> {
    const { $limit, $skip } = getPagination(context);

    return next.handle().pipe(
      map((result) => {
        const { rows: data, count: total } = result;
        return { $limit, $skip, total, data };
      }),
    );
  }
}
