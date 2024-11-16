import { DEFAULT_GROUPING, type TrendCursorsData } from '../../state';
import { type TrendCursor } from '../../types';

export type AddTrendCursorAction = {
  type: 'ADD_TREND_CURSOR';
  payload: {
    trendCursor: TrendCursor;
  };
};

export const onAddTrendCursor = (
  trendCursor: TrendCursor
): AddTrendCursorAction => ({
  type: 'ADD_TREND_CURSOR',
  payload: {
    trendCursor,
  },
});

export const addTrendCursorToGroup = (
  { trendCursor }: AddTrendCursorAction['payload'],
  groups: TrendCursorsData['groups']
) => {
  const { id, group } = trendCursor;
  const currentGrouping = groups[group] ?? DEFAULT_GROUPING;

  return {
    ...groups,
    [group]: {
      ...currentGrouping,
      trendCursors: [...currentGrouping.trendCursors, id],
    },
  };
};

export const addTrendCursor = (
  { trendCursor }: AddTrendCursorAction['payload'],
  trendCursors: TrendCursorsData['trendCursors']
) => {
  const { id } = trendCursor;
  return {
    ...trendCursors,
    [id]: trendCursor,
  };
};
