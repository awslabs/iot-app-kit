import { Messages } from '../types';

export type AssistantActionPanelMessageKeys =
  | 'assistant-action-panel.numSelected'
  | 'assistant-action-panel.deepDive'
  | 'assistant-action-panel.summarize'
  | 'assistant-action-panel.chatbot';

export const AssistantActionPanel: Messages<AssistantActionPanelMessageKeys> = {
  en: {
    'assistant-action-panel.numSelected': '{numPanels} panel selected',
    'assistant-action-panel.deepDive': 'Chat with AI',
    'assistant-action-panel.summarize': 'Summarize',
    'assistant-action-panel.chatbot': 'Chat with AI',
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
