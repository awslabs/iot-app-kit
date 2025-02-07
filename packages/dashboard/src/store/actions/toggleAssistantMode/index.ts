import type { Action } from 'redux';
import type { DashboardState } from '../../state';

export interface ToggleAssistantModeActionPayload {
  mode: 'on' | 'off';
}

export interface ToggleAssistantModeAction extends Action {
  type: 'TOGGLE_ASSISTANT_MODE';
  payload: ToggleAssistantModeActionPayload;
}

export const onToggleAssistantModeAction = (
  payload: ToggleAssistantModeActionPayload
): ToggleAssistantModeAction => ({
  type: 'TOGGLE_ASSISTANT_MODE',
  payload,
});

export const toggleAssistantMode = (
  state: DashboardState,
  action: ToggleAssistantModeAction
): DashboardState => {
  return {
    ...state,
    assistant: {
      ...state.assistant,
      mode: action.payload.mode,
    },
  };
};
