import { DEFAULT_GROUPING, TrendCursorsData } from '../../state';
import { TrendCursor, TrendCursorMap } from '../../types';

export type DeleteTrendCursorAction = {
  type: 'DELETE_TREND_CURSOR';
  payload: {
    trendCursor: Pick<TrendCursor, 'group' | 'id'>;
  };
};

export const onDeleteTrendCursor = (
  trendCursor: Pick<TrendCursor, 'group' | 'id'>
): DeleteTrendCursorAction => ({
  type: 'DELETE_TREND_CURSOR',
  payload: {
    trendCursor,
  },
});

export const removeTrendCursorFromGroup = (
  { trendCursor }: DeleteTrendCursorAction['payload'],
  groups: TrendCursorsData['groups']
) => {
  const { id, group } = trendCursor;
  const currentGrouping = groups[group] ?? DEFAULT_GROUPING;
  return {
    ...groups,
    [group]: {
      ...currentGrouping,
      trendCursors: currentGrouping.trendCursors.filter(
        (trendCursorId) => trendCursorId !== id
      ),
    },
  };
};

export const deleteTrendCursor = (
  { trendCursor }: DeleteTrendCursorAction['payload'],
  trendCursors: TrendCursorsData['trendCursors']
) => {
  const { id: idToDelete } = trendCursor;
  return Object.entries(trendCursors).reduce<TrendCursorMap>(
    (grouping, [nextTrendCursorId, value]) => {
      if (idToDelete === nextTrendCursorId) return grouping;
      grouping[nextTrendCursorId] = value;
      return grouping;
    },
    {}
  );
};
