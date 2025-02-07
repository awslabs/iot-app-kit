import { initialState } from '~/store/state';
import {
  onUpdateSignificantDigitsAction,
  updateSignificantDigits,
} from './index';

it('can change significant digits', () => {
  expect(
    updateSignificantDigits(
      initialState,
      onUpdateSignificantDigitsAction({
        decimalPlaces: 10,
      })
    ).decimalPlaces
  ).toEqual(10);

  expect(
    updateSignificantDigits(
      initialState,
      onUpdateSignificantDigitsAction({
        decimalPlaces: 2,
      })
    ).decimalPlaces
  ).toEqual(2);
});

it('does not change significant digits to a negative number', () => {
  expect(
    updateSignificantDigits(
      initialState,
      onUpdateSignificantDigitsAction({
        decimalPlaces: -2,
      })
    ).decimalPlaces
  ).toEqual(0);
});
