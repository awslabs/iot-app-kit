import { createStore } from 'zustand/vanilla';

export type AssistantContextState = {
  context: string
}

export type AssistantContextActions = {
  setContext: (context: string) => void
  appendContext: (context: string) => void
}

export type AssitantContextStore = AssistantContextState & AssistantContextActions

const assitantContext = createStore<AssitantContextStore>((set) => ({
  context: '' ,
  setContext: (context: string) => set((state) => ({ context })),
  appendContext: (context: string) => 
     set((state) => ({ context: `${state.context}${context}` })),
}));

export default assitantContext;
export const setContext = (context: string) => assitantContext.getState().setContext(context);
export const appendContext = (context: string) => assitantContext.getState().appendContext(context);