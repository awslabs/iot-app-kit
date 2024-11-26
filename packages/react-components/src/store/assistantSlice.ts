import { type StateCreator } from 'zustand';
import type { ComponentId } from '../common/assistantProps';
import type { AssistantAction, IMessage } from '../hooks/useAssistant/types';

export interface AssistantState {
  messages: Array<IMessage>;
  actions: Record<ComponentId, AssistantAction>;
}

export const createAssistantSlice: StateCreator<AssistantState> = () => ({
  messages: [],
  actions: {},
});
