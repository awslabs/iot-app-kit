import React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { type EdgeMode } from '@iot-app-kit/core';
import { isEdgeModeEnabled } from '@iot-app-kit/core';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import InternalDashboard from '../internalDashboard';

import { configureDashboardStore, toDashboardState } from '~/store';

import { useDashboardPlugins } from '~/customization/api';
import type {
  DashboardClientConfiguration,
  DashboardConfiguration,
  DashboardSave,
} from '~/types';
import { ClientContext } from './clientContext';
import { QueryContext } from './queryContext';
import { getClients } from './getClients';
import { getQueries } from './getQueries';

import '@cloudscape-design/global-styles/index.css';
import '../../styles/variables.css';
import { queryClient } from '~/data/query-client';
import { PropertiesPanel } from '~/customization/propertiesSections';
import { useDashboardViewport } from '~/hooks/useDashboardViewport';
import { FpsView } from 'react-fps';

export type DashboardProperties = {
  onSave: DashboardSave;
  clientConfiguration: DashboardClientConfiguration;
  dashboardConfiguration: DashboardConfiguration;
  edgeMode?: EdgeMode;
  initialViewMode?: 'preview' | 'edit';
  name?: string;
};
const showFPSMonitor = localStorage.getItem('DASHBOARD_SHOW_FPS');

const Dashboard: React.FC<DashboardProperties> = ({
  onSave,
  clientConfiguration,
  dashboardConfiguration,
  edgeMode = 'disabled',
  initialViewMode,
  name,
}) => {
  useDashboardPlugins();
  useDashboardViewport(dashboardConfiguration.viewport);

  const readOnly = initialViewMode && initialViewMode === 'preview';
  return (
    <>
      {showFPSMonitor && <FpsView height={50} width={80} />}
      <ClientContext.Provider value={getClients(clientConfiguration)}>
        <QueryContext.Provider
          value={getQueries(clientConfiguration, edgeMode)}
        >
          <QueryClientProvider client={queryClient}>
            <Provider
              store={configureDashboardStore({
                ...toDashboardState(dashboardConfiguration),
                readOnly,
                isEdgeModeEnabled: isEdgeModeEnabled(edgeMode),
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
                  onSave={onSave}
                  editable={true}
                  name={name}
                  propertiesPanel={<PropertiesPanel />}
                  viewport={dashboardConfiguration.viewport}
                />
              </DndProvider>
            </Provider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </QueryContext.Provider>
      </ClientContext.Provider>
    </>
  );
};

export default Dashboard;
