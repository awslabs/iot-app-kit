import { CreateWidgetsAction } from './createWidget';
import { SelectWidgetsAction } from './selectWidgets';
import { MoveWidgetsAction } from './moveWidgets';
import { ResizeWidgetsAction } from './resizeWidgets';
import { ChangeDashboardWidthAction, ChangeDashboardHeightAction } from './changeDashboardSize';
import { DeleteWidgetsAction } from './deleteWidgets';
import { CopyWidgetsAction } from './copyWidgets';
import { PasteWidgetsAction } from './pasteWidgets';
import { BringWidgetsToFrontAction } from './bringToFront';
import { SendWidgetsToBackAction } from './sendToBack';

export * from './createWidget';
export * from './deleteWidgets';
export * from './selectWidgets';
export * from './copyWidgets';
export * from './pasteWidgets';
export * from './moveWidgets';
export * from './bringToFront';
export * from './sendToBack';
export * from './resizeWidgets';
export * from './changeDashboardSize';

export type DashboardAction =
  | CreateWidgetsAction
  | DeleteWidgetsAction
  | SelectWidgetsAction
  | CopyWidgetsAction
  | PasteWidgetsAction
  | MoveWidgetsAction
  | BringWidgetsToFrontAction
  | SendWidgetsToBackAction
  | ResizeWidgetsAction
  | ChangeDashboardWidthAction
  | ChangeDashboardHeightAction;
