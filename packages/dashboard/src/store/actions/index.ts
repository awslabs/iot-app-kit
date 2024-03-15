import type { CreateWidgetsAction } from './createWidget';
import type { SelectWidgetsAction } from './selectWidgets';
import type { ToggleReadOnlyAction } from './toggleReadOnly';
import type { MoveWidgetsAction } from './moveWidgets';
import type { ResizeWidgetsAction } from './resizeWidgets';
import type {
  ChangeDashboardCellSizeAction,
  ChangeDashboardGridEnabledAction,
  ChangeDashboardHeightAction,
  ChangeDashboardWidthAction,
} from './changeDashboardGrid';
import type { DeleteWidgetsAction } from './deleteWidgets';
import type { CopyWidgetsAction } from './copyWidgets';
import type { PasteWidgetsAction } from './pasteWidgets';
import type { BringWidgetsToFrontAction } from './bringToFront';
import type { SendWidgetsToBackAction } from './sendToBack';
import type { UpdateWidgetsAction } from './updateWidget';
import type { UpdateSignificantDigitsAction } from './updateSignificantDigits';
import { UpdateRefreshRateAction } from './changeRefreshRate';

export * from './createWidget';
export * from './deleteWidgets';
export * from './selectWidgets';
export * from './copyWidgets';
export * from './pasteWidgets';
export * from './moveWidgets';
export * from './bringToFront';
export * from './sendToBack';
export * from './resizeWidgets';
export * from './updateWidget';
export * from './changeDashboardGrid';
export * from './toggleReadOnly';
export * from './updateSignificantDigits';
export * from './changeRefreshRate';

export type DashboardAction =
  | CreateWidgetsAction
  | DeleteWidgetsAction
  | SelectWidgetsAction
  | CopyWidgetsAction
  | PasteWidgetsAction
  | MoveWidgetsAction
  | ToggleReadOnlyAction
  | BringWidgetsToFrontAction
  | SendWidgetsToBackAction
  | ResizeWidgetsAction
  | UpdateWidgetsAction
  | ChangeDashboardWidthAction
  | ChangeDashboardHeightAction
  | ChangeDashboardCellSizeAction
  | ChangeDashboardGridEnabledAction
  | UpdateSignificantDigitsAction
  | UpdateRefreshRateAction;
