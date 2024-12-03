import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import type { PartialDeep } from 'type-fest';
import { MockDashboardFactory } from '../../../../testing/mocks';
import { configureDashboardStore } from '../../../store';
import type { DashboardState } from '../../../store/state';
import { useSelectionGestures } from './useSelection';

const TestProvider: React.FC<{
  storeArgs?: PartialDeep<DashboardState>;
  children: ReactNode;
}> = ({ storeArgs, children }) => (
  <Provider store={configureDashboardStore(storeArgs)}>{children}</Provider>
);

it('returns user selection when performing a selection gesture', () => {
  const setActiveGesture = vi.fn();

  const { result } = renderHook(
    () =>
      useSelectionGestures({
        setActiveGesture,
        dashboardWidgets: MockDashboardFactory.get().widgets,
        cellSize: 1,
      }),
    { wrapper: ({ children }) => <TestProvider children={children} /> }
  );
  const selectionStart = { x: 0, y: 0 };
  const selectionEnd = { x: 1, y: 0 };

  act(() => {
    result.current.onSelectionStart({
      start: selectionStart,
      end: selectionEnd,
      vector: { x: 1, y: 0 },
      union: false,
    });
  });

  expect(result.current.userSelection).toEqual({
    start: selectionStart,
    end: selectionEnd,
  });

  const selectionUpdate = { x: 2, y: 0 };

  act(() => {
    result.current.onSelectionUpdate({
      start: selectionStart,
      end: selectionUpdate,
      vector: { x: 1, y: 0 },
      union: false,
    });
  });

  expect(result.current.userSelection).toEqual({
    start: selectionStart,
    end: selectionUpdate,
  });
});

it('sets the gesture to selection when performing a selection gesture', () => {
  const setActiveGesture = vi.fn();

  const { result } = renderHook(
    () =>
      useSelectionGestures({
        setActiveGesture,
        dashboardWidgets: MockDashboardFactory.get().widgets,
        cellSize: 1,
      }),
    { wrapper: ({ children }) => <TestProvider children={children} /> }
  );

  act(() => {
    result.current.onSelectionStart({
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
      vector: { x: 1, y: 0 },
      union: false,
    });
  });

  expect(setActiveGesture).toBeCalledTimes(1);
  expect(setActiveGesture).toBeCalledWith('select');
});

it('sets the userSelection to undefined when ending a selection gesture', () => {
  const setActiveGesture = vi.fn();

  const { result } = renderHook(
    () =>
      useSelectionGestures({
        setActiveGesture,
        dashboardWidgets: MockDashboardFactory.get().widgets,
        cellSize: 1,
      }),
    { wrapper: ({ children }) => <TestProvider children={children} /> }
  );

  act(() => {
    result.current.onSelectionStart({
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
      vector: { x: 1, y: 0 },
      union: false,
    });
  });

  act(() => {
    result.current.onSelectionUpdate({
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
      vector: { x: 1, y: 0 },
      union: false,
    });
  });

  act(() => {
    result.current.onSelectionEnd();
  });

  expect(result.current.userSelection).toBeUndefined();
});
