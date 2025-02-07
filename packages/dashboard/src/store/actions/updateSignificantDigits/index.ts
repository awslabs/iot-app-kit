import type { Action } from 'redux';
import type { DashboardState } from '../../state';

interface UpdateSignificantDigitsActionPayload {
  decimalPlaces?: number | undefined;
}

export interface UpdateSignificantDigitsAction extends Action {
  type: 'UPDATE_SIGNIFICANT_DIGITS';
  payload: UpdateSignificantDigitsActionPayload;
}

export const onUpdateSignificantDigitsAction = (
  payload: UpdateSignificantDigitsActionPayload
): UpdateSignificantDigitsAction => ({
  type: 'UPDATE_SIGNIFICANT_DIGITS',
  payload,
});

export const updateSignificantDigits = (
  state: DashboardState,
  action: UpdateSignificantDigitsAction
): DashboardState => ({
  ...state,
  decimalPlaces: action.payload.decimalPlaces,
});
