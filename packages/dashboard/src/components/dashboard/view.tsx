import type { EdgeMode, Viewport } from '@iot-app-kit/core';
import { isEdgeModeEnabled } from '@iot-app-kit/core';
import { QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Provider } from 'react-redux';

import { TimeSync } from '@iot-app-kit/react-components';
import { debounce } from 'lodash';
import { useDashboardPlugins } from '~/customization/api';
import { queryClient } from '~/data/query-client';
import { configureDashboardStore, toDashboardState } from '~/store';
import type {
  AssistantConfiguration,
  DashboardClientConfiguration,
  DashboardConfiguration,
  DashboardToolbar,
  ViewportChange,
} from '~/types';
import InternalDashboard from '../internalDashboard';
import { ClientContext } from './clientContext';
import { getClients } from './getClients';
import { getQueries } from './getQueries';
import { QueryContext } from './queryContext';

import '@cloudscape-design/global-styles/index.css';
import '../../styles/variables.css';

export type DashboardViewProperties = {
  clientConfiguration: DashboardClientConfiguration;
  dashboardConfiguration: DashboardConfiguration;
  assistantConfiguration?: AssistantConfiguration;
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
  assistantConfiguration,
}) => {
  // Adding Dnd provider because custom widgets may have a drag and drop context
  useDashboardPlugins();

  const debounceOnViewportChange = onViewportChange
    ? debounce(onViewportChange, 100)
    : undefined;

  const clients = useMemo(
    () => getClients(clientConfiguration),
    [clientConfiguration]
  );

  return (
    <TimeSync
      initialViewport={
        dashboardConfiguration.defaultViewport ?? { duration: '5m' }
      }
      group='dashboard-timesync'
      onViewportChange={debounceOnViewportChange}
    >
      <ClientContext.Provider value={clients}>
        <QueryContext.Provider
          value={getQueries(clientConfiguration, edgeMode)}
        >
          <QueryClientProvider client={queryClient}>
            <Provider
              store={configureDashboardStore({
                ...toDashboardState(dashboardConfiguration),
                readOnly: true,
                isEdgeModeEnabled: isEdgeModeEnabled(edgeMode),
                timeZone,
                assistant: {
                  state: assistantConfiguration?.state ?? 'DISABLED',
                },
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
                  name={name}
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
