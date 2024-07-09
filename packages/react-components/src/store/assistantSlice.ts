import { StateCreator } from 'zustand/esm';
import { IMessage } from '../hooks/useAssistant/types';

export interface AssistantStateData {
  messages: Array<IMessage>;
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
  clearAssistantState: () =>
    set(() => ({
      messages: [],
    })),
  setAssistantState: (newState) =>
    set((state) => ({
      ...state,
      messages: [...state.messages, ...newState.messages],
    })),
  getAssistantState: () => get(),
});
