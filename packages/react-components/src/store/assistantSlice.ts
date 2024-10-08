import { StateCreator } from 'zustand/esm';
import type { AssistantAction, IMessage } from '../hooks/useAssistant/types';
import type { ComponentId } from '../common/assistantProps';

export interface AssistantState {
  messages: Array<IMessage>;
  actions: Record<ComponentId, AssistantAction>;
}

export const createAssistantSlice: StateCreator<AssistantState> = () => ({
  messages: [],
  actions: {},
});
