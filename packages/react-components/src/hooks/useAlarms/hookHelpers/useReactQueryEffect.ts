import { EffectCallback } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import isEqual from 'lodash.isequal';
import { useCustomCompareEffect } from 'react-use';

const queryAsComparable = (query: UseQueryResult) => ({
  status: query.status,
  fetchStatus: query.fetchStatus,
});

const queriesAsComparable = (queries: UseQueryResult[]) =>
  queries.map(queryAsComparable);

/**
 * Tanstack useQueries hook always returns
 * a new array as it's return value when it is called.
 * See https://github.com/TanStack/query/discussions/5123
 * This means that if you want to write an effect
 * around the return value it will always
 * re-run. As a stop gap, this hook will
 * only execute when the statuses -
 * (query.status / query.fetchState) for
 * any of the queries changes.
 */
export const useReactQueryEffect = (
  effect: EffectCallback,
  deps: UseQueryResult[][] = []
) => {
  useCustomCompareEffect(effect, deps, (prevDeps, nextDeps) =>
    isEqual(
      prevDeps.flatMap(queriesAsComparable),
      nextDeps.flatMap(queriesAsComparable)
    )
  );
};
