import { TrendCursorAction } from './actions';
import {
  TrendCursorGrouping,
  TrendCursorGroupingMap,
  TrendCursorMap,
  TrendCursorValueMap,
} from './types';

export type TrendCursorsData = {
  groups: TrendCursorGroupingMap;
  trendCursors: TrendCursorMap;
  trendCursorValues: TrendCursorValueMap;
};

export const DEFAULT_TREND_CURSOR_DATA: TrendCursorsData = {
  groups: {},
  trendCursors: {},
  trendCursorValues: {},
};

export const DEFAULT_GROUPING: TrendCursorGrouping = {
  trendCursors: [],
  connectedCharts: [],
};

export type TrendCursorDispatcher = {
  trendCursorsDispatch: (action: TrendCursorAction) => void;
};

export type TrendCursorsState = TrendCursorsData & TrendCursorDispatcher;
