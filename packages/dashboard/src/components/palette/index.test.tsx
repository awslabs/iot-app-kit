import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { DASHBOARD_CONTAINER_ID } from '../grid/getDashboardPosition';
import InternalDashboard from '../internalDashboard';

import { configureDashboardStore } from '../../store';
import { useDashboardPlugins } from '../../customization/api';
import type { DashboardState } from '../../store/state';
import type { RecursivePartial } from '~/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppKitConfig } from '@iot-app-kit/react-components';
// FIXME: Export DEFAULT_APP_KIT_CONFIG from @iot-app-kit/react-components
// eslint-disable-next-line no-restricted-imports
import { DEFAULT_APP_KIT_CONFIG } from '@iot-app-kit/react-components/src/components/iot-app-kit-config/defaultValues';

const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const InternalDashboardAux = () => {
  useDashboardPlugins();
  return <InternalDashboard editable={true} />;
};

const renderDashboard = (state?: RecursivePartial<DashboardState>) => {
  const store = configureDashboardStore(state);

  const renderResults = render(
    <AppKitConfig
      customFeatureConfig={DEFAULT_APP_KIT_CONFIG.featureFlagConfig}
    >
      <QueryClientProvider client={testQueryClient}>
        <Provider store={store}>
          <DndProvider
            backend={HTML5Backend}
            options={{
              enableMouseEvents: true,
              enableKeyboardEvents: true,
            }}
          >
            <InternalDashboardAux />
          </DndProvider>
        </Provider>
      </QueryClientProvider>
    </AppKitConfig>
  );

  return { ...renderResults, store };
};

// TODO: fix these tests (likely need to mock TwinMaker client)
describe.skip('Component Palette', () => {
  it('can drag widgets onto the grid', function () {
    const { container, store } = renderDashboard();

    const draggableLine = screen.getByLabelText(/add line widget/i);
    const draggableText = screen.getByLabelText(/add text widget/i);

    const grid = container.querySelector(`#${DASHBOARD_CONTAINER_ID}`);

    if (!grid) throw new Error('could not get draggable elements for test');

    expect(store.getState().dashboardConfiguration.widgets).toHaveLength(0);

    act(() => {
      fireEvent.dragStart(draggableLine);
      fireEvent.dragEnter(grid);
      fireEvent.dragOver(grid);
      fireEvent.drop(grid);
    });

    expect(store.getState().dashboardConfiguration.widgets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'line-chart',
        }),
      ])
    );

    act(() => {
      fireEvent.dragStart(draggableText);
      fireEvent.dragEnter(grid);
      fireEvent.dragOver(grid);
      fireEvent.drop(grid);
    });

    expect(store.getState().dashboardConfiguration.widgets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'line-chart',
        }),
        expect.objectContaining({
          type: 'text',
        }),
      ])
    );
  });

  it('does not add a widget if dropped outside of grid', function () {
    const { store } = renderDashboard();

    const draggable = screen.getByLabelText(/add line widget/i);

    // Preview button is always visible, and outside of the grid area
    const previewBtn = screen.getByRole('button', { name: /preview/i });

    expect(store.getState().dashboardConfiguration.widgets).toHaveLength(0);

    act(() => {
      fireEvent.dragStart(draggable);
      fireEvent.dragEnter(previewBtn);
      fireEvent.dragOver(previewBtn);
      fireEvent.drop(previewBtn);
    });

    expect(store.getState().dashboardConfiguration.widgets).toHaveLength(0);
  });
});
