import { createStore, type StoreApi } from 'zustand/vanilla';
import { deflate, inflate } from 'pako';

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
  return String.fromCharCode(...inflate(compressed));
};
export const getContextByComponent = (componentID: ComponentID) => {
  const componentContext =
    assistantContext.getState().context[componentID] || {};
  const compressed = deflate(JSON.stringify(componentContext));
  return String.fromCharCode(...inflate(compressed));
};
export const getRawContextByComponent = (componentID: ComponentID) => {
  return assistantContext.getState().context[componentID] || {};
};
export const setContextByComponent = (
  componentID: ComponentID,
  context: ContextData
) => assistantContext.getState().setContextByComponent(componentID, context);
export const updateContextByComponent = (
  componentID: ComponentID,
  context: ContextData
) => assistantContext.getState().updateContextByComponent(componentID, context);
