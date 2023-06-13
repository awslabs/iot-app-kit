import React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { QueryClientProvider } from '@tanstack/react-query';

import InternalDashboard from '../internalDashboard';

import { configureDashboardStore, toDashboardState } from '~/store';

import { setupDashboardPlugins } from '~/customization/api';
import plugins from '~/customization/pluginsConfiguration';
import type { DashboardClientConfiguration, DashboardConfiguration, DashboardSave } from '~/types';
import { ClientContext } from './clientContext';
import { QueryContext } from './queryContext';
import { getClients } from './getClients';
import { getQueries } from './getQueries';

import '@cloudscape-design/global-styles/index.css';
import '../../styles/variables.css';
import { queryClient } from '~/data/query-client';
import { propertiesSections } from '~/customization/propertiesSections';

setupDashboardPlugins(plugins);

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
              <InternalDashboard onSave={onSave} editable={true} propertiesSections={propertiesSections} />
            </DndProvider>
          </Provider>
        </QueryClientProvider>
      </QueryContext.Provider>
    </ClientContext.Provider>
  );
};

export default Dashboard;
