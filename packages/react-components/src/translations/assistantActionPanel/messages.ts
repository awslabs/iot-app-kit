import { type Messages } from '../types';

export type AssistantActionPanelMessageKeys =
  | 'assistant-panels.numSelected'
  | 'assistant-panels.deepDive'
  | 'assistant-panels.summarize'
  | 'assistant-panels.chatbot';

export const AssistantActionPanel: Messages<AssistantActionPanelMessageKeys> = {
  en: {
    'assistant-panels.numSelected': '{numPanels} panel selected',
    'assistant-panels.deepDive': 'Chat with AI',
    'assistant-panels.summarize': 'Summarize',
    'assistant-panels.chatbot': 'Chat with AI',
  },
};
export type AssistantResultPanelMessageKeys =
  | 'assistant-result-panel.header'
  | 'assistant-result-panel.close'
  | 'assistant-result-panel.copy';

export const AssistantResultPanel: Messages<AssistantResultPanelMessageKeys> = {
  en: {
    'assistant-result-panel.header': 'Assistant summary result',
    'assistant-result-panel.close': 'Close',
    'assistant-result-panel.copy': 'Copy',
  },
};
