import { createStore, StoreApi } from 'zustand/vanilla';
import { deflate } from 'pako';

type ComponentID = string;
type ContextData = object;
type ContextPerComponent = Record<ComponentID, ContextData>;

export type AssistantContextState = {
  context: ContextPerComponent;
};

export type AssistantContextActions = {
  setContextByComponent: (
    componentID: ComponentID,
    context: ContextData
  ) => void;
  updateContextByComponent: (
    componentID: ComponentID,
    context: ContextData
  ) => void;
};

export type AssistantContextStore = AssistantContextState &
  AssistantContextActions;

const assistantContext = createStore<AssistantContextStore>(
  (_set, get: StoreApi<AssistantContextStore>['getState']) => ({
    context: {},
    setContextByComponent: (componentID: ComponentID, context: ContextData) => {
      get().context[componentID] = context;
    },
    updateContextByComponent: (
      componentID: ComponentID,
      context: ContextData
    ) => {
      get().context[componentID] = {
        ...get().context[componentID],
        ...context,
      };
    },
  })
);

export const getAssistantStore = () => assistantContext;
export const getAllAssistantContext = () => {
  const compressed = deflate(
    JSON.stringify(assistantContext.getState().context)
  );
  return btoa(String.fromCharCode(...compressed));
};
export const getContextByComponent = (componentID: ComponentID) => {
  const compressed = deflate(
    JSON.stringify(assistantContext.getState().context[componentID])
  );
  return btoa(String.fromCharCode(...compressed));
};
export const setContextByComponent = (
  componentID: ComponentID,
  context: ContextData
) => assistantContext.getState().setContextByComponent(componentID, context);
export const updateContextByComponent = (
  componentID: ComponentID,
  context: ContextData
) => assistantContext.getState().updateContextByComponent(componentID, context);
