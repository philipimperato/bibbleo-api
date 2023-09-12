import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DefaultQueryPagination implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // send query values as GET
    const isGet = req.method === 'GET';

    // want to insure there this is a find requests "**/"
    const hasNoParams = Object.keys(req.params).length > 0;

    console.log('-------------------- testig if htis is getting hit');

    if (isGet && hasNoParams) {
      const { $limit, $skip, ...queryValues } = req.query;

      req.query = {
        $limit: $limit || '50',
        $skip: $skip || '0',

        ...queryValues,
      };
    }

    next();
  }
}
