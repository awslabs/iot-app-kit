import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import uniqBy from 'lodash-es/uniqBy';
import { v4 as uuid } from 'uuid';
import type { AssistantStateTypes } from '#types';

export interface AssistantState {
  state: AssistantStateTypes;
  conversationId: string;
  isChatbotOpen: boolean;
  callerComponentId?: string;
  action?: string;
  actionId?: string;
  mode: 'on' | 'off';
  selectedQueries: {
    widgetId: string;
    widgetType: string;
    selectedProperties: number;
  }[];
}

export const initialState: AssistantState = {
  state: 'PASSIVE',
  conversationId: uuid(),
  isChatbotOpen: false,
  mode: 'off',
  selectedQueries: [],
};

export const {
  reducer,
  actions: {
    toggleAssistantMode,
    toggleChatbot,
    cleanAssistant,
    assistantSelectWidgets,
    assistantDeselectWidgets,
    assistantCleanWidgetsSelection,
  },
} = createSlice({
  name: 'assistant',
  initialState: initialState,
  reducers: {
    toggleChatbot: (
      state,
      {
        payload,
      }: PayloadAction<{
        open: boolean;
        callerComponentId: string;
        action?: 'summarize' | 'divedeep';
      }>
    ) => {
      state.isChatbotOpen = payload.open;
      state.callerComponentId = payload.callerComponentId;
      state.action = payload.action;
      state.actionId = uuid();
    },

    toggleAssistantMode: (
      state,
      { payload }: PayloadAction<{ mode: 'on' | 'off' }>
    ) => {
      state.mode = payload.mode;
    },

    cleanAssistant: (state) => {
      state.conversationId = uuid();
      state.callerComponentId = undefined;
      state.action = undefined;
      state.selectedQueries = [];
    },

    assistantSelectWidgets: (
      state,
      {
        payload,
      }: PayloadAction<{
        widgetId: string;
        widgetType: string;
        selectedProperties: number;
      }>
    ) => {
      state.selectedQueries = uniqBy(
        [...state.selectedQueries, payload],
        'widgetId'
      );
    },

    assistantDeselectWidgets: (
      state,
      { payload }: PayloadAction<{ widgetId: string }>
    ) => {
      state.selectedQueries = state.selectedQueries.filter(
        ({ widgetId }) => widgetId !== payload.widgetId
      );
    },

    assistantCleanWidgetsSelection: (state) => {
      state.selectedQueries = [];
    },
  },
});
