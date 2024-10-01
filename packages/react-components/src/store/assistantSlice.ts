import { StateCreator } from 'zustand/esm';
import type { IMessage } from '../hooks/useAssistant/types';
import type {
  ComponentId,
  AssistantActionTarget,
  AssistantActionType,
} from '../common/assistantProps';

export interface AssistantStateData {
  messages: Array<IMessage>;
  actions: Record<
    ComponentId,
    {
      target: AssistantActionTarget;
      action: AssistantActionType;
    }
  >;
}

export interface AssistantState extends AssistantStateData {
  setAssistantState: (state: AssistantStateData) => void;
  getAssistantState: () => AssistantStateData;
  clearAssistantState: () => void;
}

export const createAssistantSlice: StateCreator<AssistantState> = (
  set,
  get
) => ({
  messages: [],
  actions: {},
  clearAssistantState: () =>
    set((state) => ({
      messages: [],
      actions: {
        ...state.actions,
      },
    })),
  setAssistantState: (newState) =>
    set((state) => ({
      ...state,
      messages: [...(state.messages ?? []), ...(newState.messages ?? [])],
      actions: {
        ...(state.actions ?? {}),
        ...(newState.actions ?? {}),
      },
    })),
  getAssistantState: () => get(),
});
