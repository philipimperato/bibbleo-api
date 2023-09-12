import { ExecutionContext } from '@nestjs/common';

export const PAGINATION_DEFAULTS = {
  $limit: 10,
  $skip: 1,
};

export function getPagination(context: ExecutionContext): {
  $limit: number;
  $skip: number;
} {
  const {
    query: {
      $limit = PAGINATION_DEFAULTS.$limit,
      $skip = PAGINATION_DEFAULTS.$skip,
    },
  } = context.getArgByIndex(0);

  return {
    $limit: +$limit,
    $skip: +$skip,
  };
}
