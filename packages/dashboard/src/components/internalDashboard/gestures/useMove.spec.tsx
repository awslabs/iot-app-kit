import React, { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';

import { configureDashboardStore } from '~/store';
import { RecursivePartial } from '~/types';
import { DashboardState } from '~/store/state';

import { useMoveGestures } from './useMove';

import { onMoveWidgetsAction } from '~/store/actions';

jest.mock('../../../store/actions', () => {
  const originalModule = jest.requireActual('../../../store/actions');

  return {
    __esModule: true,
    ...originalModule,
    onMoveWidgetsAction: jest.fn(),
  };
});

const TestProvider: React.FC<{
  storeArgs?: RecursivePartial<DashboardState>;
  children: ReactNode;
}> = ({ storeArgs, children }) => <Provider store={configureDashboardStore(storeArgs)}>{children}</Provider>;

it('sets the gesture to move when performing a move gesture', () => {
  const setActiveGesture = jest.fn();

  const { result } = renderHook(
    () =>
      useMoveGestures({
        setActiveGesture,
        selectedWidgets: [],
        cellSize: 1,
      }),
    { wrapper: ({ children }) => <TestProvider children={children} /> }
  );

  act(() => {
    result.current.onMoveStart();
  });

  expect(setActiveGesture).toBeCalledTimes(1);
  expect(setActiveGesture).toBeCalledWith('move');
});

it('dispatches the move action on gesture move update and end', () => {
  (onMoveWidgetsAction as jest.Mock).mockImplementation(() => ({ type: '', payload: {} }));

  const setActiveGesture = jest.fn();

  const { result } = renderHook(
    () =>
      useMoveGestures({
        setActiveGesture,
        selectedWidgets: [],
        cellSize: 1,
      }),
    { wrapper: ({ children }) => <TestProvider children={children} /> }
  );

  act(() => {
    result.current.onMoveStart();
  });

  act(() => {
    result.current.onMoveUpdate({
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
      vector: { x: 1, y: 0 },
      union: false,
    });
  });

  expect(onMoveWidgetsAction).toBeCalledWith({
    widgets: [],
    vector: { x: 1, y: 0 },
    complete: false,
  });

  act(() => {
    result.current.onMoveEnd({
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
      vector: { x: 1, y: 0 },
      union: false,
    });
  });

  expect(onMoveWidgetsAction).toBeCalledWith({
    widgets: [],
    vector: { x: 1, y: 0 },
    complete: true,
  });

  expect(onMoveWidgetsAction).toBeCalledTimes(2);
});
