import { createStore } from 'zustand/vanilla';

export type AssistantContextState = {
  context: string;
};

export type AssistantContextActions = {
  setContext: (context: string) => void;
  appendContext: (context: string) => void;
};

export type AssistantContextStore = AssistantContextState &
  AssistantContextActions;

const assistantContext = createStore<AssistantContextStore>((set) => ({
  context: '',
  setContext: (context: string) => set(() => ({ context })),
  appendContext: (context: string) =>
    set((state) => ({ context: `${state.context}${context}` })),
}));

export const getAssistantContext = () => assistantContext;
export const setAssistantContext = (context: string) =>
  assistantContext.getState().setContext(context);
export const appendAssistantContext = (context: string) =>
  assistantContext.getState().appendContext(context);
