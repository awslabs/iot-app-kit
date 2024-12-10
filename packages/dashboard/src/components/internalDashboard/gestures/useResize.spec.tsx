import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import type { PartialDeep } from 'type-fest';
import type { Mock } from 'vitest';
import { configureDashboardStore } from '../../../store';
import { onResizeWidgetsAction } from '../../../store/actions';
import type { DashboardState } from '../../../store/state';
import { useResizeGestures } from './useResize';

vi.mock('../../../store/actions', async () => {
  const originalModule = await vi.importActual('../../../store/actions');

  return {
    __esModule: true,
    ...originalModule,
    onResizeWidgetsAction: vi.fn(),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

const TestProvider: React.FC<{
  storeArgs?: PartialDeep<DashboardState>;
  children: ReactNode;
}> = ({ storeArgs, children }) => (
  <Provider store={configureDashboardStore(storeArgs)}>{children}</Provider>
);

it('sets the gesture to resize when performing a resize gesture', () => {
  const setActiveGesture = vi.fn();

  const { result } = renderHook(
    () =>
      useResizeGestures({
        setActiveGesture,
        selectedWidgets: [],
        cellSize: 1,
      }),
    { wrapper: ({ children }) => <TestProvider children={children} /> }
  );

  act(() => {
    result.current.onResizeStart('bottom');
  });

  expect(setActiveGesture).toBeCalledTimes(1);
  expect(setActiveGesture).toBeCalledWith('resize');
});

it('dispatches the resize action on gesture resize update and end', () => {
  (onResizeWidgetsAction as Mock).mockImplementation(() => ({
    type: '',
    payload: {},
  }));

  const setActiveGesture = vi.fn();

  const { result } = renderHook(
    () =>
      useResizeGestures({
        setActiveGesture,
        selectedWidgets: [],
        cellSize: 1,
      }),
    { wrapper: ({ children }) => <TestProvider children={children} /> }
  );

  act(() => {
    result.current.onResizeStart('bottom');
  });

  act(() => {
    result.current.onResizeUpdate({
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
      vector: { x: 1, y: 0 },
      union: false,
    });
  });

  expect(onResizeWidgetsAction).toBeCalledWith({
    widgets: [],
    anchor: 'bottom',
    vector: { x: 1, y: 0 },
    complete: false,
  });

  act(() => {
    result.current.onResizeEnd({
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
      vector: { x: 1, y: 0 },
      union: false,
    });
  });

  expect(onResizeWidgetsAction).toBeCalledWith({
    widgets: [],
    anchor: 'bottom',
    vector: { x: 1, y: 0 },
    complete: true,
  });

  expect(onResizeWidgetsAction).toBeCalledTimes(2);
});

it('doesnt dispatch the resize action on gesture resize update and end if there is no anchor', () => {
  (onResizeWidgetsAction as Mock).mockImplementation(() => ({
    type: '',
    payload: {},
  }));

  const setActiveGesture = vi.fn();

  const { result } = renderHook(
    () =>
      useResizeGestures({
        setActiveGesture,
        selectedWidgets: [],
        cellSize: 1,
      }),
    { wrapper: ({ children }) => <TestProvider children={children} /> }
  );

  act(() => {
    result.current.onResizeStart(null);
  });

  act(() => {
    result.current.onResizeUpdate({
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
      vector: { x: 1, y: 0 },
      union: false,
    });
  });

  act(() => {
    result.current.onResizeEnd({
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
      vector: { x: 1, y: 0 },
      union: false,
    });
  });

  expect(onResizeWidgetsAction).not.toBeCalled();
});
