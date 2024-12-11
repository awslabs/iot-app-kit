import { initialState } from '../../state-old';
import {
  onUpdateSignificantDigitsAction,
  updateSignificantDigits,
} from './index';

it('can change significant digits', () => {
  expect(
    updateSignificantDigits(
      initialState,
      onUpdateSignificantDigitsAction({
        significantDigits: 10,
      })
    ).significantDigits
  ).toEqual(10);

  expect(
    updateSignificantDigits(
      initialState,
      onUpdateSignificantDigitsAction({
        significantDigits: 2,
      })
    ).significantDigits
  ).toEqual(2);
});

it('does not change significant digits to a negative number', () => {
  expect(
    updateSignificantDigits(
      initialState,
      onUpdateSignificantDigitsAction({
        significantDigits: -2,
      })
    ).significantDigits
  ).toEqual(0);
});
