import uniqBy from 'lodash-es/uniqBy';
import { v4 as uuid } from 'uuid';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { AssistantStateTypes } from '../../types';

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

export type ToggleChatbot = (params: {
  open: boolean;
  callerComponentId: string;
  action?: 'summarize' | 'divedeep';
}) => void;

export type ToggleAssistantMode = () => void;
export type CleanAssistant = VoidFunction;

export type AssistantSelectWidgets = (params: {
  widgetId: string;
  widgetType: string;
  selectedProperties: number;
}) => void;

export type AssistantDeselectWidgets = (params: { widgetId: string }) => void;

export type AssistantCleanWidgetsSelection = VoidFunction;

export interface AssistantActions {
  toggleChatbot: ToggleChatbot;
  toggleAssistantMode: ToggleAssistantMode;
  cleanAssistant: CleanAssistant;
  assistantSelectWidgets: AssistantSelectWidgets;
  assistantDeselectWidgets: AssistantDeselectWidgets;
  assistantCleanWidgetsSelection: AssistantCleanWidgetsSelection;
}

export const useAssistantStore = create<AssistantState & AssistantActions>()(
  immer((set) => ({
    state: 'PASSIVE',
    conversationId: uuid(),
    isChatbotOpen: false,
    mode: 'off',
    selectedQueries: [],

    toggleChatbot: ({ open, callerComponentId, action }) => {
      set((state) => {
        state.isChatbotOpen = open;
        state.callerComponentId = callerComponentId;
        state.action = action;
        state.actionId = uuid();
      });
    },

    toggleAssistantMode: () => {
      set((state) => {
        state.mode = state.mode === 'on' ? 'off' : 'on'
      });
    },

    cleanAssistant: () => {
      set((state) => {
        state.conversationId = uuid();
        state.callerComponentId = undefined;
        state.action = undefined;
        state.selectedQueries = [];
      });
    },

    assistantSelectWidgets: ({ widgetId, widgetType, selectedProperties }) => {
      set((state) => {
        state.selectedQueries = uniqBy(
          [
            ...state.selectedQueries,
            { widgetId, widgetType, selectedProperties },
          ],
          'widgetId'
        );
      });
    },

    assistantDeselectWidgets: ({ widgetId }) => {
      set((state) => {
        state.selectedQueries = state.selectedQueries.filter(
          (query) => query.widgetId !== widgetId
        );
      });
    },

    assistantCleanWidgetsSelection: () => {
      set((state) => {
        state.selectedQueries = [];
      });
    },
  }))
);
