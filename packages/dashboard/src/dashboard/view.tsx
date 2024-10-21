import '@cloudscape-design/global-styles/index.css';
import { Viewport, type EdgeMode } from '@iot-app-kit/core';
import { TimeSync } from '@iot-app-kit/react-components';
import { QueryClientProvider } from '@tanstack/react-query';
import { debounce } from 'lodash';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Provider } from 'react-redux';
import { useDashboardPlugins } from '~/customization/api';
import { queryClient } from '~/data/query-client';
import { createStore } from '~/store/store';
import '~/styles/variables.css';
import type {
  DashboardClientConfiguration,
  DashboardConfiguration,
  DashboardToolbar,
  ViewportChange,
} from '~/types';
import { ClientContext } from './clientContext';
import { getClients } from './getClients';
import { getQueries } from './getQueries';
import InternalDashboard from './internalDashboard';
import { QueryContext } from './queryContext';

export type DashboardViewProperties = {
  clientConfiguration: DashboardClientConfiguration;
  dashboardConfiguration: DashboardConfiguration;
  edgeMode?: EdgeMode;
  name?: string;
  onViewportChange?: ViewportChange;
  currentViewport?: Viewport;
  toolbar?: DashboardToolbar;
  timeZone?: string;
};

const DashboardView: React.FC<DashboardViewProperties> = ({
  clientConfiguration,
  dashboardConfiguration,
  edgeMode = 'disabled',
  name,
  onViewportChange,
  currentViewport,
  toolbar,
  timeZone,
}) => {
  // Adding Dnd provider because custom widgets may have a drag and drop context
  useDashboardPlugins();

  const debounceOnViewportChange = onViewportChange
    ? debounce(onViewportChange, 100)
    : undefined;

  return (
    <TimeSync
      initialViewport={
        dashboardConfiguration.defaultViewport ?? { duration: '5m' }
      }
      group='dashboard-timesync'
      onViewportChange={debounceOnViewportChange}
    >
      <ClientContext.Provider value={getClients(clientConfiguration)}>
        <QueryContext.Provider
          value={getQueries(clientConfiguration, edgeMode)}
        >
          <QueryClientProvider client={queryClient}>
            <Provider
              store={createStore({
                dashboardConfiguration,
              })}
            >
              <DndProvider
                backend={TouchBackend}
                options={{
                  enableMouseEvents: true,
                  enableKeyboardEvents: true,
                }}
              >
                <InternalDashboard
                  editable={false}
                  defaultViewport={dashboardConfiguration.defaultViewport}
                  currentViewport={currentViewport}
                  toolbar={toolbar}
                />
              </DndProvider>
            </Provider>
          </QueryClientProvider>
        </QueryContext.Provider>
      </ClientContext.Provider>
    </TimeSync>
  );
};

export default DashboardView;
