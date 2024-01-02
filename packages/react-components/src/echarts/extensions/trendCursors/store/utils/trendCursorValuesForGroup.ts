import { DEFAULT_GROUPING, TrendCursorsData } from '../state';
import { TrendCursorGroupId } from '../types';

export const trendCursorValuesForGroup = (
  group: TrendCursorGroupId,
  state: TrendCursorsData
) => {
  const grouping = state.groups[group] ?? DEFAULT_GROUPING;
  const trendCursorsToSelect = grouping.trendCursors;
  return trendCursorsToSelect.map((id) => state.trendCursorValues[id] ?? {});
};
