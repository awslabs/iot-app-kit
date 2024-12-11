import type { Action } from 'redux';
import { nonNegative } from '../../../util/number';
import type { DashboardState } from '../../state-old';

type UpdateSignificantDigitsActionPayload = {
  significantDigits: number;
};
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
  significantDigits: nonNegative(action.payload.significantDigits),
});
