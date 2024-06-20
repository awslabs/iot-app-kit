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
  setContext: (context: string) => set((state) => ({ context })),
  appendContext: (context: string) =>
    set((state) => ({ context: `${state.context}${context}` })),
}));

export default assistantContext;
export const setContext = (context: string) =>
  assistantContext.getState().setContext(context);
export const appendContext = (context: string) =>
  assistantContext.getState().appendContext(context);
