import '@cloudscape-design/global-styles/index.css';
import { type EdgeMode, type Viewport } from '@iot-app-kit/core';
import { TimeSync } from '@iot-app-kit/react-components';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { debounce } from 'lodash';
import React, { memo, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { FpsView } from 'react-fps';
import { Provider } from 'react-redux';
import { useDashboardPlugins } from '~/customization/api';
import { PropertiesPanel } from '~/customization/propertiesSections';
import { queryClient } from '~/data/query-client';
import { DashboardContext } from '~/services/dashboard-context';
import { createStore } from '~/store/store';
import '~/styles/variables.css';
import type {
  DashboardClientConfiguration,
  DashboardConfiguration,
  DashboardConfigurationChange,
  DashboardSave,
  DashboardToolbar,
  ViewportChange,
} from '~/types';
import { ClientContext } from './clientContext';
import { getClients } from './getClients';
import { getQueries } from './getQueries';
import InternalDashboard from './internalDashboard';
import { QueryContext } from './queryContext';

export type DashboardProperties = {
  onDashboardConfigurationChange?: DashboardConfigurationChange;
  onSave?: DashboardSave;
  clientConfiguration: DashboardClientConfiguration;
  dashboardConfiguration: DashboardConfiguration;
  edgeMode?: EdgeMode;
  toolbar?: DashboardToolbar;
  initialViewMode?: 'preview' | 'edit';
  name?: string;
  onViewportChange?: ViewportChange;
  currentViewport?: Viewport;
  timeZone?: string;
};
const showFPSMonitor = localStorage.getItem('DASHBOARD_SHOW_FPS');

const Dashboard: React.FC<DashboardProperties> = ({
  onSave,
  clientConfiguration,
  dashboardConfiguration,
  edgeMode = 'disabled',
  initialViewMode,
  toolbar,
  name,
  currentViewport,
  onViewportChange,
  onDashboardConfigurationChange,
  timeZone,
}) => {
  useDashboardPlugins();
  const debounceOnViewportChange = onViewportChange
    ? debounce(onViewportChange, 100)
    : undefined;

  const readOnly = useMemo(() => {
    return initialViewMode && initialViewMode === 'preview';
  }, [initialViewMode]);

  const initialStore = useMemo(() => {
    return createStore({
      dashboardConfiguration,
    });
  }, [dashboardConfiguration]);

  const clients = useMemo(
    () => getClients(clientConfiguration),
    [JSON.stringify(clientConfiguration)]
  );
  const queries = useMemo(
    () => getQueries(clientConfiguration, edgeMode),
    [clientConfiguration, edgeMode]
  );

  const dashboardContext = useMemo(
    () => ({ timeZone, name, edgeMode, onSave }),
    [timeZone, name, edgeMode, onSave]
  );

  return (
    <>
      {showFPSMonitor && <FpsView height={50} width={80} />}
      <ClientContext.Provider value={clients}>
        <QueryContext.Provider value={queries}>
          <QueryClientProvider client={queryClient}>
            <Provider store={initialStore}>
              <DndProvider
                backend={TouchBackend}
                options={{
                  enableMouseEvents: true,
                  enableKeyboardEvents: true,
                }}
              >
                <TimeSync
                  initialViewport={
                    dashboardConfiguration.defaultViewport ?? { duration: '5m' }
                  }
                  group='dashboard-timesync'
                  onViewportChange={debounceOnViewportChange}
                >
                  <DashboardContext.Provider value={dashboardContext}>
                    <InternalDashboard
                      toolbar={toolbar}
                      editable={true}
                      propertiesPanel={<PropertiesPanel />}
                      defaultViewport={dashboardConfiguration.defaultViewport}
                      currentViewport={currentViewport}
                      onDashboardConfigurationChange={
                        onDashboardConfigurationChange
                      }
                    />
                  </DashboardContext.Provider>
                </TimeSync>
              </DndProvider>
            </Provider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </QueryContext.Provider>
      </ClientContext.Provider>
    </>
  );
};

export default memo(Dashboard);
