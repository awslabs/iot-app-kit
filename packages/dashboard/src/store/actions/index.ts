import { CreateWidgetsAction } from './createWidget';
import { SelectWidgetsAction } from './selectWidgets';
import { MoveWidgetsAction } from './moveWidgets';
import { ChangeDashboardWidthAction, ChangeDashboardHeightAction } from './changeDashboardSize';

export * from './createWidget';
export * from './selectWidgets';
export * from './moveWidgets';
export * from './changeDashboardSize';

export type DashboardAction =
  | CreateWidgetsAction
  | SelectWidgetsAction
  | MoveWidgetsAction
  | ChangeDashboardWidthAction
  | ChangeDashboardHeightAction;
