import { type UseQueryResult } from '@tanstack/react-query';

export const aggregateStatuses = (statuses: UseQueryResult[]) => ({
  isPending: statuses.some((status) => status.isPending),
  isError: statuses.some((status) => status.isError),
  isSuccess: statuses.some((status) => status.isSuccess),
  isLoading: statuses.some((status) => status.isLoading),
  isFetching: statuses.some((status) => status.isFetching),
});
