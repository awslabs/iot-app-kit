import { DEFAULT_GROUPING, TrendCursorsData } from '../state';
import { TrendCursor, TrendCursorGroupId } from '../types';

export const trendCursorsForGroup = (
  group: TrendCursorGroupId,
  state: TrendCursorsData
) => {
  const grouping = state.groups[group] ?? DEFAULT_GROUPING;
  const trendCursorsToSelect = grouping.trendCursors;
  return trendCursorsToSelect
    .map((id) => state.trendCursors[id])
    .filter((trendCursor): trendCursor is TrendCursor => trendCursor != null);
};
