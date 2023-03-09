import React, { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';

import { configureDashboardStore } from '~/store';
import { RecursivePartial } from '~/types';
import { DashboardState } from '~/store/state';
import { MockDashboardFactory } from '../../../../testing/mocks';

import { useGestures } from './index';
import { anchorable, gestureable, idable } from './determineTargetGestures';

const TestProvider: React.FC<{
  storeArgs?: RecursivePartial<DashboardState>;
  children: ReactNode;
}> = ({ storeArgs, children }) => <Provider store={configureDashboardStore(storeArgs)}>{children}</Provider>;

const widgetGestureAttribute = gestureable('widget');
const resizeGestureAttribute = gestureable('resize');
const anchorAttribute = anchorable('bottom');
const idAttribute = idable('widget-1');

const mockWidget = document.createElement('div');
mockWidget.setAttribute(Object.keys(widgetGestureAttribute)[0], Object.values(widgetGestureAttribute)[0]);
mockWidget.setAttribute(Object.keys(idAttribute)[0], Object.values(idAttribute)[0]);

const mockAnchor = document.createElement('div');
mockAnchor.setAttribute(Object.keys(resizeGestureAttribute)[0], Object.values(resizeGestureAttribute)[0]);
mockAnchor.setAttribute(Object.keys(anchorAttribute)[0], Object.values(anchorAttribute)[0]);

const mockGrid = document.createElement('div');

it('sets the active gesture to move when moving an unselected widget', () => {
  const { result } = renderHook(
    () =>
      useGestures({
        dashboardConfiguration: MockDashboardFactory.get(),
        selectedWidgets: [],
        cellSize: 1,
      }),
    { wrapper: ({ children }) => <TestProvider children={children} /> }
  );
  const gestureStart = { x: 0, y: 0 };
  const gestureEnd = { x: 1, y: 0 };

  act(() => {
    result.current.onGestureStart({
      target: mockWidget,
      start: gestureStart,
      end: gestureEnd,
      vector: { x: 1, y: 0 },
      union: false,
    });
  });

  expect(result.current.activeGesture).toEqual('move');
});

it('sets the active gesture to move when moving a selected widget', () => {
  const { result } = renderHook(
    () =>
      useGestures({
        dashboardConfiguration: MockDashboardFactory.get(),
        selectedWidgets: [{ id: 'widget-1', x: 0, y: 0, z: 0, height: 1, width: 1, type: 'iot-kpi', properties: {} }],
        cellSize: 1,
      }),
    { wrapper: ({ children }) => <TestProvider children={children} /> }
  );
  const gestureStart = { x: 0, y: 0 };
  const gestureEnd = { x: 1, y: 0 };

  act(() => {
    result.current.onGestureStart({
      target: mockWidget,
      start: gestureStart,
      end: gestureEnd,
      vector: { x: 1, y: 0 },
      union: false,
    });
  });

  expect(result.current.activeGesture).toEqual('move');
});

it('sets the active gesture to resize when moving an anchor', () => {
  const { result } = renderHook(
    () =>
      useGestures({
        dashboardConfiguration: MockDashboardFactory.get(),
        selectedWidgets: [{ id: 'widget-1', x: 0, y: 0, z: 0, height: 1, width: 1, type: 'iot-kpi', properties: {} }],
        cellSize: 1,
      }),
    { wrapper: ({ children }) => <TestProvider children={children} /> }
  );
  const gestureStart = { x: 0, y: 0 };
  const gestureEnd = { x: 1, y: 0 };

  act(() => {
    result.current.onGestureStart({
      target: mockAnchor,
      start: gestureStart,
      end: gestureEnd,
      vector: { x: 1, y: 0 },
      union: false,
    });
  });

  expect(result.current.activeGesture).toEqual('resize');
});

it('sets the active gesture to select when moving on the grid', () => {
  const { result } = renderHook(
    () =>
      useGestures({
        dashboardConfiguration: MockDashboardFactory.get(),
        selectedWidgets: [{ id: 'widget-1', x: 0, y: 0, z: 0, height: 1, width: 1, type: 'iot-kpi', properties: {} }],
        cellSize: 1,
      }),
    { wrapper: ({ children }) => <TestProvider children={children} /> }
  );
  const gestureStart = { x: 0, y: 0 };
  const gestureEnd = { x: 1, y: 0 };

  act(() => {
    result.current.onGestureStart({
      target: mockGrid,
      start: gestureStart,
      end: gestureEnd,
      vector: { x: 1, y: 0 },
      union: false,
    });
  });

  expect(result.current.activeGesture).toEqual('select');
});

it('resets the active gesture after the gesture ends', () => {
  const { result } = renderHook(
    () =>
      useGestures({
        dashboardConfiguration: MockDashboardFactory.get(),
        selectedWidgets: [{ id: 'widget-1', x: 0, y: 0, z: 0, height: 1, width: 1, type: 'iot-kpi', properties: {} }],
        cellSize: 1,
      }),
    { wrapper: ({ children }) => <TestProvider children={children} /> }
  );
  const gestureStart = { x: 0, y: 0 };
  const gestureEnd = { x: 1, y: 0 };

  act(() => {
    result.current.onGestureStart({
      target: mockGrid,
      start: gestureStart,
      end: gestureEnd,
      vector: { x: 1, y: 0 },
      union: false,
    });
  });

  act(() => {
    result.current.onGestureUpdate({
      target: mockGrid,
      start: gestureStart,
      end: gestureEnd,
      vector: { x: 1, y: 0 },
      union: false,
    });
  });

  act(() => {
    result.current.onGestureEnd({
      target: mockGrid,
      start: gestureStart,
      end: gestureEnd,
      vector: { x: 1, y: 0 },
      union: false,
    });
  });

  expect(result.current.activeGesture).toEqual(undefined);
});
