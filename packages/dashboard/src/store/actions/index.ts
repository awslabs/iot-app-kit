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
import { type UpdateRefreshRateAction } from './changeRefreshRate';
import { type UpdateDefaultViewportAction } from './updateDefaultViewport';
import { type ToggleChatbotAction } from './toggleChatbot';
import { type ToggleAssistantModeAction } from './toggleAssistantMode';
import {
  type AssistantSelectWidgetsAction,
  type AssistantDeselectWidgetsAction,
  type AssistantCleanWidgetsSelectionAction,
} from './assistantWidgetsSelection';
import { type CleanAssistantAction } from './cleanAssistant';

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
export * from './updateDefaultViewport';
export * from './toggleChatbot';
export * from './toggleAssistantMode';
export * from './assistantWidgetsSelection';
export * from './cleanAssistant';

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
  | UpdateRefreshRateAction
  | UpdateDefaultViewportAction
  | ToggleChatbotAction
  | ToggleAssistantModeAction
  | AssistantSelectWidgetsAction
  | AssistantDeselectWidgetsAction
  | AssistantCleanWidgetsSelectionAction
  | CleanAssistantAction;
