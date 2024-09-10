import { UseQueryResult } from '@tanstack/react-query';
import { AlarmDataStatus } from '../types';

/**
 * getStatusForQuery builds the AlarmDataStatus for a tanstack query result.
 * Since AlarmData is built on multiple queries the status can be combined with a previous query.
 *
 * @param query is the tanstack query result with a status
 * @param oldStatus is the status from a previous query, which is combined with the given query
 * @returns an AlarmDataStatus for the query
 */
export const getStatusForQuery = (
  query: UseQueryResult,
  oldStatus?: AlarmDataStatus
): AlarmDataStatus => {
  let errors: Error[] | undefined =
    query.error !== null ? [query.error] : undefined;
  let status: AlarmDataStatus = {
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    isSuccess: query.isSuccess,
    isError: query.isError,
    errors,
  };
  if (oldStatus) {
    if (oldStatus.errors) {
      errors = errors ? [...oldStatus.errors, ...errors] : oldStatus.errors;
    }
    status = {
      isLoading: status.isLoading || oldStatus.isLoading,
      isRefetching: status.isRefetching || oldStatus.isRefetching,
      isSuccess: status.isSuccess && oldStatus.isSuccess,
      isError: status.isError || oldStatus.isError,
      errors,
    };
  }

  return status;
};
