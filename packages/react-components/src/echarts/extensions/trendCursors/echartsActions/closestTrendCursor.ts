import { type TrendCursorModel } from '../model';

export const closestTrendCursor = (
  date: number,
  trendCursors: TrendCursorModel[]
) => {
  if (trendCursors.length === 0) return null;
  return trendCursors.reduce<TrendCursorModel | null>((closest, nextCursor) => {
    const nextDate = nextCursor.date;
    if (!nextDate) return null;
    if (!closest) return nextCursor;
    const closestDate = closest.date;
    if (!closestDate) return null;
    return Math.abs(nextDate - date) < Math.abs(closestDate - date)
      ? nextCursor
      : closest;
  }, null);
};
