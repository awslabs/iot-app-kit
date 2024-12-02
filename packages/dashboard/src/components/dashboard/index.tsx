import '@cloudscape-design/global-styles/index.css';
import { isEdgeModeEnabled } from '@iot-app-kit/core';
import { TimeSync } from '@iot-app-kit/react-components';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import debounce from 'lodash-es/debounce';
import { memo, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Provider } from 'react-redux';
import { useDashboardPlugins } from '../../customization/api';
import { PropertiesPanel } from '../../customization/propertiesSections';
import { queryClient } from '../../data/query-client';
import { configureDashboardStore, toDashboardState } from '../../store';
import '../../styles/variables.css';
import { type DashboardProps } from '../../types';
import InternalDashboard from '../internalDashboard';
import { ClientContext } from './clientContext';
import { getClients } from './getClients';
import { getQueries } from './getQueries';
import { QueryContext } from './queryContext';

const Dashboard: React.FC<DashboardProps> = ({
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
  assistantConfiguration,
}) => {
  useDashboardPlugins();
  const debounceOnViewportChange = onViewportChange
    ? debounce(onViewportChange, 100)
    : undefined;

  const readOnly = useMemo(() => {
    return initialViewMode && initialViewMode === 'preview';
  }, [initialViewMode]);

  const initialStore = useMemo(() => {
    return configureDashboardStore({
      ...toDashboardState(dashboardConfiguration),
      readOnly,
      isEdgeModeEnabled: isEdgeModeEnabled(edgeMode),
      timeZone: timeZone,
      assistant: {
        state: assistantConfiguration?.state ?? 'DISABLED',
      },
    });
  }, [
    dashboardConfiguration,
    edgeMode,
    readOnly,
    timeZone,
    assistantConfiguration?.state,
  ]);

  const clients = useMemo(
    () => getClients(clientConfiguration),
    [clientConfiguration]
  );
  const queries = useMemo(
    () => getQueries(clientConfiguration, edgeMode),
    [clientConfiguration, edgeMode]
  );

  return (
    <>
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
                  <InternalDashboard
                    toolbar={toolbar}
                    onSave={onSave}
                    editable={true}
                    name={name}
                    propertiesPanel={<PropertiesPanel />}
                    defaultViewport={dashboardConfiguration.defaultViewport}
                    currentViewport={currentViewport}
                    onDashboardConfigurationChange={
                      onDashboardConfigurationChange
                    }
                  />
                </TimeSync>
              </DndProvider>
            </Provider>
            <ReactQueryDevtools
              initialIsOpen={false}
              buttonPosition='bottom-left'
            />
          </QueryClientProvider>
        </QueryContext.Provider>
      </ClientContext.Provider>
    </>
  );
};

export default memo(Dashboard);
