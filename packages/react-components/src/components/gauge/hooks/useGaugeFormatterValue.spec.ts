import { renderHook } from '@testing-library/react';
import { useGaugeFormatterValue } from './useGaugeFormatterValue';

describe('useGaugeFormatterValue', () => {
  it('formats value correctly with default precision', () => {
    const { result } = renderHook(() =>
      useGaugeFormatterValue({
        unit: 'kg',
        settings: { showUnit: true },
        decimalPlaces: 2,
      })
    );

    expect(result.current.getFormatterValue(42.5678)).toBe(
      '{value|42.57} {unit| kg}'
    );
  });

  it('formats value correctly without unit when showUnit is false', () => {
    const { result } = renderHook(() =>
      useGaugeFormatterValue({
        unit: 'kg',
        settings: { showUnit: false },
        decimalPlaces: 2,
      })
    );

    expect(result.current.getFormatterValue(42.5678)).toBe('{value|42.57}');
  });

  it('formats value correctly when unit is missing', () => {
    const { result } = renderHook(() =>
      useGaugeFormatterValue({
        settings: { showUnit: true },
        decimalPlaces: 2,
      })
    );

    expect(result.current.getFormatterValue(42.5678)).toBe('{value|42.57}');
  });

  it('returns "-" for falsy values (0, null, undefined)', () => {
    const { result } = renderHook(() =>
      useGaugeFormatterValue({
        unit: 'kg',
        settings: { showUnit: true },
        decimalPlaces: 2,
      })
    );

    expect(result.current.getFormatterValue(0)).toBe('-');
    expect(result.current.getFormatterValue(null as unknown as number)).toBe(
      '-'
    );
    expect(
      result.current.getFormatterValue(undefined as unknown as number)
    ).toBe('-');
  });

  it('handles different significantDigits values', () => {
    const { result } = renderHook(() =>
      useGaugeFormatterValue({
        unit: 'kg',
        settings: { showUnit: true },
        decimalPlaces: 3,
      })
    );

    expect(result.current.getFormatterValue(42.5678)).toBe(
      '{value|42.568} {unit| kg}'
    );
  });

  it('reacts to dependency changes', () => {
    const { result, rerender } = renderHook(
      ({ unit, showUnit, digits }) =>
        useGaugeFormatterValue({
          unit,
          settings: { showUnit },
          decimalPlaces: digits,
        }),
      {
        initialProps: { unit: 'kg', showUnit: true, digits: 2 },
      }
    );

    expect(result.current.getFormatterValue(42.5678)).toBe(
      '{value|42.57} {unit| kg}'
    );

    rerender({ unit: 'lbs', showUnit: true, digits: 2 });
    expect(result.current.getFormatterValue(42.5678)).toBe(
      '{value|42.57} {unit| lbs}'
    );

    rerender({ unit: 'lbs', showUnit: false, digits: 2 });
    expect(result.current.getFormatterValue(42.5678)).toBe('{value|42.57}');
  });
});
