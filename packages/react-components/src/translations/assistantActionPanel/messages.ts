import { Messages } from '../types';

export type AssistantActionPanelMessageKeys =
  | 'assistant-action-panel.numSelected'
  | 'assistant-action-panel.deepDive'
  | 'assistant-action-panel.summarize'
  | 'assistant-action-panel.chatbot';

export const AssistantActionPanel: Messages<AssistantActionPanelMessageKeys> = {
  en: {
    'assistant-action-panel.numSelected': '{numPanels} panel selected',
    'assistant-action-panel.deepDive': 'Deep dive',
    'assistant-action-panel.summarize': 'Summarize',
    'assistant-action-panel.chatbot': 'Chatbot',
  },
};
