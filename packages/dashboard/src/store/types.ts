import type { PartialDeep } from 'type-fest';
import type { Reducer, StateFromReducersMapObject } from '@reduxjs/toolkit';
import type { PreloadedState } from 'redux';
import type { StateWithHistory } from 'redux-undo';
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import type { createStore } from './store';
import type { AssistantState } from '#features/assistant/store';
import type { ContextMenuState } from '#features/context-menu/store';
import type { ModeState } from '#features/mode/store';
import type { PanelState } from '#features/panels/store';
import type { SelectionState } from '#features/selection/store';
import type { SavingState } from '#features/saving/store';
import type { DashboardState } from '../dashboard-configuration/store';

export type PayloadFromActionCreator<AC> = AC extends ActionCreatorWithPayload<
  infer Payload
>
  ? Payload
  : never;

export type Store = ReturnType<typeof createStore>;

export type RootState = StateFromReducersMapObject<{
  assistant: Reducer<AssistantState>;
  mode: Reducer<ModeState>;
  dashboard: Reducer<StateWithHistory<DashboardState>>;
  selection: Reducer<SelectionState>;
  contextMenu: Reducer<ContextMenuState>;
  saving: Reducer<SavingState>;
  panels: Reducer<PanelState>;
}>;

export type Dispatch = Store['dispatch'];
export type PreloadedRootState = PartialDeep<PreloadedState<RootState>>;
