import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';

import { configureDashboardStore } from '~/store';
import { useGridSettings } from './useGridSettings';
import type { ReactNode } from 'react';
import { initialState } from '~/store/state';

const TestProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => <Provider store={configureDashboardStore(initialState)}>{children}</Provider>;

it('has initial values', () => {
  const { result } = renderHook(() => useGridSettings(), {
    wrapper: ({ children }) => <TestProvider children={children} />,
  });

  expect(result.current.rows).toBe(initialState.grid.height);
  expect(result.current.columns).toBe(initialState.grid.width);
  expect(result.current.cellSize).toBe(initialState.grid.cellSize);
  expect(result.current.stretchToFit).toBe(initialState.grid.stretchToFit);
  expect(result.current.stretchToFit).toBe(initialState.grid.stretchToFit);
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

  const initialStretchToFit = initialState.grid.stretchToFit;
  act(() => {
    result.current.onToggleStretchToFit(!initialStretchToFit);
  });
  expect(result.current.stretchToFit).toBe(!initialStretchToFit);
});
