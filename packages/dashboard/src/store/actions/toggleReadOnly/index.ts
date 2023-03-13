import type { PayloadAction } from '@reduxjs/toolkit';
import type { DashboardState } from '../../state';

export interface ToggleReadOnlyAction extends PayloadAction<null> {
  type: 'TOGGLE_READ_ONLY';
}

export const onToggleReadOnly = (): ToggleReadOnlyAction => ({
  type: 'TOGGLE_READ_ONLY',
  payload: null,
});

export const toggleReadOnly = (state: DashboardState): DashboardState => {
  const isReadOnly = state.readOnly;

  return {
    ...state,
    readOnly: !isReadOnly,
  };
};
