import { CreateWidgetsAction } from './createWidget';
import { SelectWidgetsAction } from './selectWidgets';
import { MoveWidgetsAction } from './moveWidgets';
import { ResizeWidgetsAction } from './resizeWidgets';
import { ChangeDashboardWidthAction, ChangeDashboardHeightAction } from './changeDashboardSize';
import { DeleteWidgetsAction } from './deleteWidgets';

export * from './createWidget';
export * from './deleteWidgets';
export * from './selectWidgets';
export * from './moveWidgets';
export * from './resizeWidgets';
export * from './changeDashboardSize';

export type DashboardAction =
  | CreateWidgetsAction
  | DeleteWidgetsAction
  | SelectWidgetsAction
  | MoveWidgetsAction
  | ResizeWidgetsAction
  | ChangeDashboardWidthAction
  | ChangeDashboardHeightAction;
