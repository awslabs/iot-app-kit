import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';

import type { ReactNode } from 'react';
import { configureDashboardStore } from '~/store';
import { initialState } from '~/store/state';
import { useGridSettings } from './useGridSettings';

const TestProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => (
  <Provider store={configureDashboardStore(initialState)}>{children}</Provider>
);

it('has initial values', () => {
  const { result } = renderHook(() => useGridSettings(), {
    wrapper: ({ children }) => <TestProvider children={children} />,
  });

  expect(result.current.rows).toBe(initialState.grid.height);
  expect(result.current.columns).toBe(initialState.grid.width);
  expect(result.current.cellSize).toBe(initialState.grid.cellSize);
  expect(result.current.significantDigits).toBe(initialState.significantDigits);
});

it('has can change values', () => {
  const { result } = renderHook(() => useGridSettings(), {
    wrapper: ({ children }) => <TestProvider children={children} />,
  });

  const initialCellSize = initialState.grid.cellSize;
  act(() => {
    result.current.onChangeCellSize(initialCellSize + 1);
  });
  expect(result.current.cellSize).toBe(initialCellSize + 1);

  const initialHeight = initialState.grid.height;
  act(() => {
    result.current.onChangeNumberOfRows(initialHeight + 1);
  });
  expect(result.current.rows).toBe(initialHeight + 1);

  const initialWidth = initialState.grid.width;
  act(() => {
    result.current.onChangeNumberOfColumns(initialWidth + 1);
  });
  expect(result.current.columns).toBe(initialWidth + 1);

  const initialSignificantDigits = initialState.significantDigits;
  act(() => {
    result.current.onChangeSignificantDigits(initialSignificantDigits + 1);
  });
  expect(result.current.significantDigits).toBe(initialSignificantDigits + 1);
});
