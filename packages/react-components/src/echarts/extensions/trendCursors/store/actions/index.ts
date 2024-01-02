import { AddTrendCursorAction } from './addTrendCursor';
import { ConnectAction } from './connect';
import { DeleteTrendCursorAction } from './deleteTrendCursor';
import { DisconnectAction } from './disconnect';
import { UpdateTrendCursorAction } from './updateTrendCursor';
import { SetTrendCursorValuesAction } from './setTrendCursorValue';

export * from './connect';
export * from './disconnect';
export * from './addTrendCursor';
export * from './deleteTrendCursor';
export * from './updateTrendCursor';
export * from './setTrendCursorValue';

export type TrendCursorAction =
  | ConnectAction
  | DisconnectAction
  | AddTrendCursorAction
  | DeleteTrendCursorAction
  | UpdateTrendCursorAction
  | SetTrendCursorValuesAction;
