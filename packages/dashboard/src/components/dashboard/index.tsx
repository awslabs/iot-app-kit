import React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import InternalDashboard from '../internalDashboard';

import { configureDashboardStore, toDashboardState } from '~/store';

import { useDashboardPlugins } from '~/customization/api';
import type { DashboardClientConfiguration, DashboardConfiguration, DashboardSave } from '~/types';
import { ClientContext } from './clientContext';
import { QueryContext } from './queryContext';
import { getClients } from './getClients';
import { getQueries } from './getQueries';

import '@cloudscape-design/global-styles/index.css';
import '../../styles/variables.css';
import { queryClient } from '~/data/query-client';
import { PropertiesPanel } from '~/customization/propertiesSections';
import { useDashboardViewport } from '~/hooks/useDashboardViewport';

if (process.env.NODE_ENV === 'development') {
  const { worker } = require('../../msw/browser');
  worker.start();
}

export type DashboardProperties = {
  onSave: DashboardSave;
  clientConfiguration: DashboardClientConfiguration;
  dashboardConfiguration: DashboardConfiguration;
  initialViewMode?: 'preview' | 'edit';
};

const Dashboard: React.FC<DashboardProperties> = ({
  onSave,
  clientConfiguration,
  dashboardConfiguration,
  initialViewMode,
}) => {
  useDashboardPlugins();
  useDashboardViewport(dashboardConfiguration.viewport);

  const readOnly = initialViewMode && initialViewMode === 'preview';
  return (
    <ClientContext.Provider value={getClients(clientConfiguration)}>
      <QueryContext.Provider value={getQueries(clientConfiguration)}>
        <QueryClientProvider client={queryClient}>
          <Provider store={configureDashboardStore({ ...toDashboardState(dashboardConfiguration), readOnly })}>
            <DndProvider
              backend={TouchBackend}
              options={{
                enableMouseEvents: true,
                enableKeyboardEvents: true,
              }}
            >
              <InternalDashboard onSave={onSave} editable={true} propertiesPanel={<PropertiesPanel />} />
            </DndProvider>
          </Provider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </QueryContext.Provider>
    </ClientContext.Provider>
  );
};

export default Dashboard;
