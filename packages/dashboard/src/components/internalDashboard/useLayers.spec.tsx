import React, { ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';

import { configureDashboardStore } from '~/store';
import { RecursivePartial } from '~/types';
import { DashboardState } from '~/store/state';

import { useLayers } from './useLayers';
import { MockDashboardFactory, MockWidgetFactory } from '../../../testing/mocks';

const TestProvider: React.FC<{
  storeArgs?: RecursivePartial<DashboardState>;
  children: ReactNode;
}> = ({ storeArgs, children }) => <Provider store={configureDashboardStore(storeArgs)}>{children}</Provider>;

it('has default layers', () => {
  const { result } = renderHook(() => useLayers(), { wrapper: ({ children }) => <TestProvider children={children} /> });

  expect(result.current.selectionBoxLayer).toBeGreaterThan(0);
  expect(result.current.userSelectionLayer).toBeGreaterThan(0);
  expect(result.current.contextMenuLayer).toBeGreaterThan(0);
  expect(result.current.selectionGestureLayer).toBeLessThan(0);

  expect(result.current.userSelectionLayer).toBeGreaterThan(result.current.selectionBoxLayer);
  expect(result.current.contextMenuLayer).toBeGreaterThan(result.current.userSelectionLayer);
});

it('has updates the layers to be greater than the highest widget in the dashboard configuration', () => {
  const zTest = 100;
  const dashboardConfiguration = MockDashboardFactory.get({
    widgets: [
      MockWidgetFactory.getKpiWidget({ z: zTest }),
      MockWidgetFactory.getKpiWidget({ z: zTest - 10 }),
      MockWidgetFactory.getKpiWidget({ z: zTest - 20 }),
      MockWidgetFactory.getKpiWidget({ z: zTest - 50 }),
    ],
  });
  const { result } = renderHook(() => useLayers(), {
    wrapper: ({ children }) => <TestProvider storeArgs={{ dashboardConfiguration }} children={children} />,
  });

  expect(result.current.selectionBoxLayer).toBeGreaterThan(zTest);
  expect(result.current.userSelectionLayer).toBeGreaterThan(zTest);
  expect(result.current.contextMenuLayer).toBeGreaterThan(zTest);
  expect(result.current.selectionGestureLayer).toBeLessThan(zTest);

  expect(result.current.userSelectionLayer).toBeGreaterThan(result.current.selectionBoxLayer);
  expect(result.current.contextMenuLayer).toBeGreaterThan(result.current.userSelectionLayer);
});
