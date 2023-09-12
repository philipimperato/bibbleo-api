import { ExecutionContext } from '@nestjs/common';

export function getPagination(context: ExecutionContext): {
  $limit: number;
  $skip: number;
} {
  const {
    query: { $limit, $skip },
  } = context.getArgByIndex(0);

  return {
    $limit: +$limit,
    $skip: +$skip,
  };
}
