import { type TrendCursorsData } from '../../state';
import { type TrendCursor } from '../../types';

export type UpdateTrendCursorAction = {
  type: 'UPDATE_TREND_CURSOR';
  payload: {
    trendCursor: TrendCursor;
  };
};

export const onUpdateTrendCursor = (
  trendCursor: TrendCursor
): UpdateTrendCursorAction => ({
  type: 'UPDATE_TREND_CURSOR',
  payload: {
    trendCursor,
  },
});

export const updateTrendCursor = (
  { trendCursor }: UpdateTrendCursorAction['payload'],
  trendCursors: TrendCursorsData['trendCursors']
) => {
  const { id } = trendCursor;
  return {
    ...trendCursors,
    [id]: trendCursor,
  };
};
