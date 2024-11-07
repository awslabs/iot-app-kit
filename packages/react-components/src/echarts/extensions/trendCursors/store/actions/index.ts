import { type AddTrendCursorAction } from './addTrendCursor';
import { type ConnectAction } from './connect';
import { type DeleteTrendCursorAction } from './deleteTrendCursor';
import { type DisconnectAction } from './disconnect';
import { type UpdateTrendCursorAction } from './updateTrendCursor';
import { type SetTrendCursorValuesAction } from './setTrendCursorValue';

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
