import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import type { PartialDeep } from 'type-fest';
import { configureDashboardStore } from '../../store/index-old';
import type { DashboardState } from '../../store/state-old';
import {
  MockDashboardFactory,
  MockWidgetFactory,
} from '../../../testing/mocks';
import { useLayers } from './useLayers';

const TestProvider: React.FC<{
  storeArgs?: PartialDeep<DashboardState>;
  children: ReactNode;
}> = ({ storeArgs, children }) => (
  <Provider store={configureDashboardStore(storeArgs)}>{children}</Provider>
);

it('has default layers', () => {
  const { result } = renderHook(() => useLayers(), {
    wrapper: ({ children }) => <TestProvider children={children} />,
  });

  expect(result.current.selectionBoxLayer).toBeGreaterThan(0);
  expect(result.current.userSelectionLayer).toBeGreaterThan(0);
  expect(result.current.contextMenuLayer).toBeGreaterThan(0);
  expect(result.current.selectionGestureLayer).toBeLessThan(0);

  expect(result.current.userSelectionLayer).toBeGreaterThan(
    result.current.selectionBoxLayer
  );
  expect(result.current.contextMenuLayer).toBeGreaterThan(
    result.current.userSelectionLayer
  );
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
    wrapper: ({ children }) => (
      <TestProvider
        storeArgs={{ dashboardConfiguration }}
        children={children}
      />
    ),
  });

  expect(result.current.selectionBoxLayer).toBeGreaterThan(zTest);
  expect(result.current.userSelectionLayer).toBeGreaterThan(zTest);
  expect(result.current.contextMenuLayer).toBeGreaterThan(zTest);
  expect(result.current.selectionGestureLayer).toBeLessThan(zTest);

  expect(result.current.userSelectionLayer).toBeGreaterThan(
    result.current.selectionBoxLayer
  );
  expect(result.current.contextMenuLayer).toBeGreaterThan(
    result.current.userSelectionLayer
  );
});
