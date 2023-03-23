import React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

import InternalDashboard from '../internalDashboard';

import { configureDashboardStore } from '~/store';

import { setupDashboardPlugins } from '~/customization/api';
import plugins from '~/customization/pluginsConfiguration';
import type { DashboardClientConfiguration, DashboardConfiguration, DashboardSave } from '~/types';
import { ClientContext } from './clientContext';
import { QueryContext } from './queryContext';
import { getClients } from './getClients';
import { getQueries } from './getQueries';

import '@cloudscape-design/global-styles/index.css';
import '../../styles/variables.css';

setupDashboardPlugins(plugins);

export type DashboardProps = {
  onSave: DashboardSave;
  clientConfiguration: DashboardClientConfiguration;
  dashboardConfiguration: DashboardConfiguration;
};

const Dashboard: React.FC<DashboardProps> = ({ onSave, clientConfiguration, ...dashboardState }) => {
  return (
    <ClientContext.Provider value={getClients(clientConfiguration)}>
      <QueryContext.Provider value={getQueries(clientConfiguration)}>
        <Provider store={configureDashboardStore({ ...dashboardState })}>
          <DndProvider
            backend={TouchBackend}
            options={{
              enableMouseEvents: true,
              enableKeyboardEvents: true,
            }}
          >
            <InternalDashboard onSave={onSave} />
          </DndProvider>
        </Provider>
      </QueryContext.Provider>
    </ClientContext.Provider>
  );
};

export default Dashboard;
