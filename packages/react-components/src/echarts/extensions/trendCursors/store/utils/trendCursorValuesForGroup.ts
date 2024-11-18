import { DEFAULT_GROUPING, type TrendCursorsData } from '../state';
import { type TrendCursorGroupId } from '../types';

export const trendCursorValuesForGroup = (
  group: TrendCursorGroupId,
  state: TrendCursorsData
) => {
  const grouping = state.groups[group] ?? DEFAULT_GROUPING;
  const trendCursorsToSelect = grouping.trendCursors;
  return trendCursorsToSelect.map((id) => state.trendCursorValues[id] ?? {});
};
