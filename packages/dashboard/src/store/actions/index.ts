import { CreateWidgetsAction } from './createWidget';
import { SelectWidgetsAction } from './selectWidgets';
import { ToggleReadOnlyAction } from './toggleReadOnly';
import { MoveWidgetsAction } from './moveWidgets';
import { ResizeWidgetsAction } from './resizeWidgets';
import {
  ChangeDashboardGridEnabledAction,
  ChangeDashboardHeightAction,
  ChangeDashboardWidthAction,
} from './changeDashboardGrid';
import { DeleteWidgetsAction } from './deleteWidgets';
import { CopyWidgetsAction } from './copyWidgets';
import { PasteWidgetsAction } from './pasteWidgets';
import { BringWidgetsToFrontAction } from './bringToFront';
import { SendWidgetsToBackAction } from './sendToBack';
import { UpdateWidgetsAction } from './updateWidget';
import { UpdateViewportAction } from './updateViewport';
import { UpdateAssetQueryAction } from './updateAssetQuery';
import { UpdateAssetsDescriptionMapAction } from './updateAssetsDescription';

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
export * from './updateViewport';
export * from './toggleReadOnly';

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
  | ChangeDashboardGridEnabledAction
  | UpdateViewportAction
  | UpdateAssetQueryAction
  | UpdateAssetsDescriptionMapAction;
