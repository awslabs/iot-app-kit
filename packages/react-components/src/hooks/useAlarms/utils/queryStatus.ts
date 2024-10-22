import { UseQueryResult } from '@tanstack/react-query';
import { SetOptional } from 'type-fest';
import type { AlarmDataStatus } from '../types';

/**
 * Combine two query statuses.
 *
 * If any one status isLoading/Refetching/Error is true then the running status is also true
 * If any one status isSuccess is false then running status is also false
 */
const combineStatuses = ({
  oldStatus,
  newStatus,
}: {
  oldStatus: AlarmDataStatus;
  newStatus: AlarmDataStatus;
}): AlarmDataStatus => ({
  isLoading: oldStatus.isLoading || newStatus.isLoading,
  isRefetching: oldStatus.isRefetching || newStatus.isRefetching,
  isSuccess: oldStatus.isSuccess && newStatus.isSuccess,
  isError: oldStatus.isError || newStatus.isError,
});

/**
 * Create the AlarmDataStatus for a tanstack query result.
 * Since AlarmData is built on multiple queries the status
 * can be combined with a previous query.
 *
 * @param query is the tanstack query result with a status
 * @param oldStatus is the status from a previous query, which is combined with the given query
 * @returns an AlarmDataStatus for the query
 */
export const getStatusForQuery = (
  query: SetOptional<
    Pick<
      UseQueryResult,
      'isLoading' | 'isRefetching' | 'isSuccess' | 'isError' | 'error'
    >,
    'error'
  >,
  oldStatus?: AlarmDataStatus
): AlarmDataStatus => {
  let status: AlarmDataStatus = {
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    isSuccess: query.isSuccess,
    isError: query.isError,
  };
  if (oldStatus) {
    status = combineStatuses({ oldStatus, newStatus: status });
  }

  return status;
};

/**
 * Resolves a single status between multiple queries and
 * the status of a previous query
 *
 * @param queries are the tanstack query results each with their own status
 * @param oldStatus is the status from a previous query, which is combined with the given queries
 * @returns one AlarmDataStatus
 */
export const combineStatusForQueries = (
  queries: SetOptional<
    Pick<
      UseQueryResult,
      'isLoading' | 'isRefetching' | 'isSuccess' | 'isError' | 'error'
    >,
    'error'
  >[],
  oldStatus?: AlarmDataStatus
) => {
  let status: AlarmDataStatus = {
    isLoading: queries.some(({ isLoading }) => isLoading),
    isRefetching: queries.some(({ isRefetching }) => isRefetching),
    isSuccess: queries.every(({ isSuccess }) => isSuccess),
    isError: queries.some(({ isError }) => isError),
  };

  if (oldStatus) {
    status = combineStatuses({ oldStatus, newStatus: status });
  }

  return status;
};
