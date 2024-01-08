import * as React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { render, fireEvent, screen } from '@testing-library/react';

import InternalDashboard from './index';
import { configureDashboardStore } from '~/store';
import { useDashboardPlugins } from '../../customization/api';
import { DashboardWidgetsConfiguration } from '~/types';
import { initialState } from '~/store/state';

import { AppKitConfig } from '@iot-app-kit/react-components';
// FIXME: Export DEFAULT_APP_KIT_CONFIG from @iot-app-kit/react-components
// eslint-disable-next-line no-restricted-imports
import { DEFAULT_APP_KIT_CONFIG } from '@iot-app-kit/react-components/src/components/iot-app-kit-config/defaultValues';
import { HTML5Backend } from 'react-dnd-html5-backend';

const EMPTY_DASHBOARD: DashboardWidgetsConfiguration = {
  widgets: [],
  viewport: { duration: '10m' },
};

jest.mock('../../store/actions', () => {
  const originalModule = jest.requireActual('../../store/actions');

  return {
    __esModule: true,
    ...originalModule,
    onDeleteWidgetsAction: jest.fn(),
  };
});

// TODO: fix these tests (likely need to mock TwinMaker client)
it.skip('saves when the save button is pressed with default grid settings provided', function () {
  const onSave = jest.fn().mockImplementation(() => Promise.resolve());

  const getState = () => ({
    ...initialState,
    grid: { ...initialState.grid, width: 100, height: 100, cellSize: 20 },
  });

  const { rerender } = render(
    <Provider store={configureDashboardStore(getState())}>
      <DndProvider
        backend={TouchBackend}
        options={{
          enableMouseEvents: true,
          enableKeyboardEvents: true,
        }}
      >
        <InternalDashboard editable={true} onSave={onSave} />
      </DndProvider>
    </Provider>
  );

  fireEvent.click(screen.getByRole('button', { name: /save/i }));

  expect(onSave).toBeCalledWith(
    expect.objectContaining({
      ...EMPTY_DASHBOARD,
      displaySettings: {
        cellSize: 20,
        numColumns: 100,
        numRows: 100,
        significantDigits: 4,
      },
    })
  );

  rerender(
    <Provider store={configureDashboardStore(getState())}>
      <DndProvider
        backend={TouchBackend}
        options={{
          enableMouseEvents: true,
          enableKeyboardEvents: true,
        }}
      >
        <InternalDashboard editable={true} onSave={onSave} />
      </DndProvider>
    </Provider>
  );

  fireEvent.click(screen.getByRole('button', { name: /save/i }));

  expect(onSave).toBeCalledWith(
    expect.objectContaining({
      ...EMPTY_DASHBOARD,
      displaySettings: {
        cellSize: 20,
        numColumns: 100,
        numRows: 100,
        significantDigits: 4,
      },
    })
  );
});

// TODO: fix these tests (likely need to mock TwinMaker client)
it.skip('renders preview mode', function () {
  const args = {
    readOnly: true,
    dashboardConfiguration: EMPTY_DASHBOARD,
  };
  render(
    <Provider store={configureDashboardStore(args)}>
      <DndProvider
        backend={TouchBackend}
        options={{
          enableMouseEvents: true,
          enableKeyboardEvents: true,
        }}
      >
        <InternalDashboard />
      </DndProvider>
    </Provider>
  );

  expect(screen.queryByText(/time machine/i)).toBeInTheDocument();
  expect(screen.queryByText(/actions/i)).not.toBeInTheDocument();
});

// TODO: fix these tests (likely need to mock TwinMaker client)
it.skip('toggles to preview mode and hides the component library', function () {
  const args = {
    readOnly: false,
    dashboardConfiguration: EMPTY_DASHBOARD,
  };

  render(
    <Provider store={configureDashboardStore(args)}>
      <DndProvider
        backend={TouchBackend}
        options={{
          enableMouseEvents: true,
          enableKeyboardEvents: true,
        }}
      >
        <InternalDashboard editable={true} onSave={() => Promise.resolve()} />
      </DndProvider>
    </Provider>
  );

  fireEvent.click(screen.getByRole('button', { name: /preview/i }));

  expect(screen.queryByText(/time machine/i)).toBeInTheDocument();
  expect(screen.queryByText(/actions/i)).toBeInTheDocument();
});

// TODO: fix these tests (likely need to mock TwinMaker client)
it.skip('empty state within the dashboard when no widget is selected', function () {
  const args = {
    readOnly: false,
    dashboardConfiguration: EMPTY_DASHBOARD,
  };

  const InternalDashboardAux = () => {
    useDashboardPlugins();
    return <InternalDashboard editable={true} />;
  };

  render(
    <AppKitConfig
      customFeatureConfig={DEFAULT_APP_KIT_CONFIG.featureFlagConfig}
    >
      <Provider store={configureDashboardStore(args)}>
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
    </AppKitConfig>
  );

  expect(screen.getByTestId('empty-state')).toBeInTheDocument();
});
