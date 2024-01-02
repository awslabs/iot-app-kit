export type TrendCursorValueId = string;
export type TrendCursorValue = {
  id: TrendCursorValueId;
  trendCursorId: TrendCursorId;
  value?: number;
  name?: string;
};

export type TrendCursorId = string;
export type TrendCursorGroupId = string;
export type TrendCursor = {
  id: TrendCursorId;
  group: TrendCursorGroupId;
  date: number;
  color?: string;
};

export type UpdaterAction = 'add' | 'update' | 'remove';
export type Updater = (
  trendCursors: TrendCursor[],
  action: UpdaterAction
) => void;

export type TrendCursorMap = { [key in TrendCursorId]: TrendCursor };
export type TrendCursorGrouping = {
  trendCursors: TrendCursorId[];
  connectedCharts: Updater[];
};
export type TrendCursorGroupingMap = {
  [key in TrendCursorGroupId]: TrendCursorGrouping;
};
export type TrendCursorValues = {
  [key in TrendCursorValueId]: TrendCursorValue;
};
export type TrendCursorValueMap = { [key in TrendCursorId]: TrendCursorValues };
