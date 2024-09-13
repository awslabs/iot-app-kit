import { TimeOrdering } from '@aws-sdk/client-iotsitewise';
import { FetchMode } from '../types';

export const mapTimeOrdering = ({
  timeOrdering,
  fetchMode,
}: {
  timeOrdering?: TimeOrdering;
  fetchMode?: FetchMode;
}) => {
  if (
    fetchMode === 'MOST_RECENT_BEFORE_END' ||
    fetchMode === 'MOST_RECENT_BEFORE_START'
  ) {
    return 'DESCENDING';
  }

  return timeOrdering ?? 'DESCENDING';
};
